import {
  KEY,
  ALERT_KEY,
  GRAPHQL_MOCK_EXTENSION_ID,
  DEFAULT_CONFIGURATION,
  PAGE_READY_KEY,
} from "./constant";
import {
  StorageValue,
  Message,
  Generate,
} from "./types";

// tools
export const delayByMilliseconds = (ms: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

export const postMessage = (value: StorageValue, pageLoad: boolean) => {
  window.postMessage(
    {
      key: KEY,
      value,
      pageLoad,
    },
    "*"
  );
};

export const getStorage = <StorageValue = any>(key: string) =>
  new Promise<StorageValue | null>((resolve) => {
    chrome.storage.local.get(key, (storage) => {
      resolve(storage[key]);
    });
  });

export const setStorage = <StorageValue = any>(
  key: string,
  value: StorageValue
) =>
  new Promise<StorageValue | null>((resolve) => {
    chrome.storage.local.set(
      {
        [key]: value,
      },
      () => resolve
    );
  });

const checkExtensionIsInstalled = () =>
  !!document.getElementById(GRAPHQL_MOCK_EXTENSION_ID);

export const openComponentInEditor = () => {
  type DebugSource = {
    columnNumber?: number;
    fileName?: string;
    lineNumber?: number;
  };
  type FiberNode = {
    _debugSource?: DebugSource;
    _debugOwner?: FiberNode;
  };

  const getFiberNodeInstance = (element) => {
    for (const key in element) {
      if (key.startsWith("__reactInternalInstance") || key.startsWith("__reactFiber$") || key.startsWith("__reactFiber")) {
        console.log("Found React Fiber instance for element:", element, "Key:", key);
        return element[key];
      }
    }
    console.log("No React Fiber instance found for element:", element);
    return null;
  };
  
  const getFallbackDebugSourceFromElement = (element) => {
    const parentElement = element.parentElement;
    if (element.tagName === "HTML" || parentElement === null) {
      console.warn("Couldn't find a React instance for the element", element);
      return null;
    }
    const fiberNodeInstance = getFiberNodeInstance(element);
    if (fiberNodeInstance && fiberNodeInstance._debugSource) {
      return fiberNodeInstance._debugSource;
    }
    return getFallbackDebugSourceFromElement(parentElement);
  };
  
  const getFallbackDebugSource = (fiberNodeInstance, element) => {
    if (fiberNodeInstance?._debugOwner) {
      if (fiberNodeInstance._debugOwner._debugSource) {
        return fiberNodeInstance._debugOwner._debugSource;
      } else {
        return getFallbackDebugSource(fiberNodeInstance._debugOwner, element);
      }
    } else {
      return getFallbackDebugSourceFromElement(element);
    }
  };
  
  const getDebugSource = (element) => {
    const fiberNodeInstance = getFiberNodeInstance(element);
    if (fiberNodeInstance && fiberNodeInstance._debugSource) {
      return fiberNodeInstance._debugSource;
    }
    return getFallbackDebugSource(fiberNodeInstance, element);
  };
  
  // Option(Alt) + Click
  window.addEventListener("click", (event) => {
    event.stopPropagation();
    if (event.altKey) {
      const { target } = event;
      if (target instanceof HTMLElement) {
        console.log("Element clicked:", target);
        const debugSource = getDebugSource(target);
        console.log("Debug source:", debugSource);
        if (!debugSource) {
          console.warn("Couldn't find debug source for element:", target);
          return;
        }
        const { columnNumber, fileName, lineNumber } = debugSource;
        const url = `vscode://file/${fileName}:${lineNumber}:${columnNumber}`;
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = url;
        document.body.appendChild(iframe);
        setTimeout(() => {
          iframe.remove();
        }, 100);
      }
    }
  });
};

export const isEffectivePluginSwitch = (lastEffectiveTimestamp: number) =>
  (Date.now() - lastEffectiveTimestamp) / (60 * 60 * 1000) < 12;

export const buildGraphqlPluginSetting = (
  storage: Partial<StorageValue>
): StorageValue => ({
  ...DEFAULT_CONFIGURATION,
  ...storage,
  pluginSwitchOn:
    !!storage.pluginSwitchOn &&
    isEffectivePluginSwitch(storage.lastEffectiveTimestamp ?? Date.now()),
});

export const handleMessageEvent = async (generate: Generate) => {
  let isFirstExecution = true;
  const isExtensionInstalled = checkExtensionIsInstalled();

  if (isExtensionInstalled && isFirstExecution) {
    window.graphQLPlugin = {};
    window.postMessage(
      {
        key: PAGE_READY_KEY,
        value: true,
      },
      "*"
    );
  }

  const handlePluginSetting = async (data: any) => {
    const graphQLPluginSetting = buildGraphqlPluginSetting(data.value ?? {});
  
    const {
      entrypoints = [],
      blockResourceRules = [],
      ajaxRules = [],
      staticResourceRules = [],
      mainFrameText,
    } = await generate(graphQLPluginSetting, isFirstExecution);
  
    return {
      entrypoints,
      blockResourceRules,
      ajaxRules,
      staticResourceRules,
      mainFrameText,
    };
  };
  
  const handlePluginEnabled = (isPluginEnabled: boolean) => {
    if (isPluginEnabled && !window.sessionStorage.getItem(ALERT_KEY)) {
      window.sessionStorage.setItem(ALERT_KEY, "true");
      if (isFirstExecution) {
        console.log(
          "🚀 Graphql Easy Mock is running in your website for the first time!"
        );
      }
    }
  };
  
  const handleFirstExecution = (isPluginEnabled: boolean, mainFrameText: string) => {
    if (isFirstExecution) {
      !isExtensionInstalled && window.graphQLPlugin?.blockObserver?.disconnect();
  
      if (mainFrameText) {
        document.write(mainFrameText);
      }
  
      if (isPluginEnabled) {
        document.title = `${document.title} (GraphQL Easy Mock)`;
      }
  
      isFirstExecution = false;
    }
  };
  
  window.addEventListener("message", async (e: MessageEvent<Message>) => {
    const { data } = e;
  
    if (data?.key === KEY) {
      try {
        const {
          entrypoints,
          blockResourceRules,
          ajaxRules,
          staticResourceRules,
          mainFrameText,
        } = await handlePluginSetting(data);
  
        const isPluginEnabled =
          entrypoints.length > 0 ||
          blockResourceRules.length > 0 ||
          ajaxRules.length > 0 ||
          staticResourceRules.length > 0;
  
        handlePluginEnabled(isPluginEnabled);
        handleFirstExecution(isPluginEnabled, mainFrameText);
  
      } catch (error) {
        console.log(error);
      }
    }
  });
};
