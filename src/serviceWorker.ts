import { Storage, Changes, StorageValue } from './utils/types';
import { KEY } from './utils/constant';

let ruleId = 1;
let appSetting: StorageValue = { pluginSwitchOn: false };

const createEmptyRules = (): chrome.declarativeNetRequest.Rule[] => {
  const rules: chrome.declarativeNetRequest.Rule[] = [];
  return rules;
};

const applyRules = async (): Promise<void> => {
  const iconPath = appSetting.pluginSwitchOn ? '/images/graphql.png' : '/images/graphql-disable.png';
  chrome.action.setIcon({ path: iconPath });

  const currentRuleIds = (await chrome.declarativeNetRequest.getDynamicRules()).map((rule) => rule.id);
  if (currentRuleIds.length > 0) {
    ruleId = Math.max(...currentRuleIds) + 1;
  }

  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: createEmptyRules(),
    removeRuleIds: currentRuleIds,
  });
};

const loadStoredSettings = (): void => {
  chrome.storage.local.get(KEY, async (storage: Storage) => {
    if (storage[KEY]?.pluginSwitchOn) {
      appSetting = { pluginSwitchOn: storage[KEY].pluginSwitchOn || false };
      applyRules();
    } else {
      chrome.action.setIcon({ path: '/images/graphql-disable.png' });
    }
  });
};

const handleStorageChanges = async (changes: Changes, areaName: string): Promise<void> => {
  if (areaName === 'local' && changes[KEY]) {
    appSetting = { pluginSwitchOn: changes[KEY].newValue.pluginSwitchOn || false };
    applyRules();
  }
};

const initializeServiceWorker = (): void => {
  loadStoredSettings();
  chrome.storage.onChanged.addListener(handleStorageChanges);
  chrome.runtime.onStartup.addListener(loadStoredSettings);
};

initializeServiceWorker();