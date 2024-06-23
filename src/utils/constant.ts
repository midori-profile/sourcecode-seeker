import { ApplicationRule } from "./types";

// key
export const KEY = 'GRAPHQL_MOCK_SETTING';
export const USER_ID_KEY = 'GRAPHQL_MOCK_UUID';
export const ALERT_KEY = 'GRAPHQL_MOCK_ALERT';
export const SWITCH_COOKIE_KEY = 'GRAPHQL_SWITCH';
export const PAGE_READY_KEY = 'PAGE_READY_KEY';
export const GRAPHQL_MOCK_EXTENSION_ID = 'graphql-script-id';

// default config
export const DEFAULT_MOCK_RESPONSE_LIST = [
  { name: '', value: '', disabled: false },
];

export const DEFAULT_UTILS = {
  mockResponse: true,
  openCompInEditor: true,
};

export const DEFAULT_CONFIGURATION = {
  pluginSwitchOn: false,
  pluginMockResponseList: DEFAULT_MOCK_RESPONSE_LIST,
  utils: DEFAULT_UTILS,
};

export const DEFAULT_APPLICATION_RULE: ApplicationRule = {
  blockResourceRules: [],
  entrypoints: [],
  staticResourceRules: [],
  ajaxRules: [],
};
