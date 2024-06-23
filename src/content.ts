import {
  KEY,
  GRAPHQL_MOCK_EXTENSION_ID,
  PAGE_READY_KEY,
} from "./utils/constant";
import {
  isEffectivePluginSwitch,
  postMessage,
  getStorage,
} from "./utils/utils";
import { Changes, StorageValue } from "./utils/types";


const createScriptElement = (): HTMLScriptElement => {
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", chrome.runtime.getURL(`utils.js`));
  script.setAttribute("id", GRAPHQL_MOCK_EXTENSION_ID);
  document.documentElement.appendChild(script);
  return script;
};

const waitScriptLoaded = (script: HTMLScriptElement): Promise<Event> =>
  new Promise((resolve, reject) => {
    script.addEventListener("load", resolve);
    script.addEventListener("error", reject);
  });

const handlePluginSwitch = async (value: StorageValue): Promise<void> => {
  if (
    value.pluginSwitchOn &&
    !isEffectivePluginSwitch(value.lastEffectiveTimestamp ?? Date.now())
  ) {
    value.pluginSwitchOn = false;
    chrome.storage.local.set({ [KEY]: value });
  }
};

const handleMessageEvent = (value: StorageValue, observer: MutationObserver) => (
  event: MessageEvent<{ key: string; value: string }>
): void => {
  if (event.data.key === PAGE_READY_KEY && event.data.value) {
    postMessage(value, true);
    observer.disconnect();
  }
};

const handleStorageChange = (changes: Changes, areaName: string): void => {
  if (areaName === "local" && changes[KEY]) {
    postMessage(changes[KEY].newValue, false);
  }
};

const main = async function () {
  const script = createScriptElement();
  let observer: MutationObserver;

  const value = (
    await Promise.all([getStorage(KEY), waitScriptLoaded(script)])
  )[0] as StorageValue;

  await handlePluginSwitch(value);

  window.addEventListener(
    "message",
    handleMessageEvent(value, observer)
  );

  chrome.storage.onChanged.addListener(handleStorageChange);
};

main();