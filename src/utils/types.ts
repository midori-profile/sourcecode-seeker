import { KEY } from './constant';

// storage
export type StorageKey = typeof KEY;

export type StorageValue = {
  pluginSwitchOn?: boolean;
  pluginMockResponseList?: App[];
  lastEffectiveTimestamp?: number;
};

export type Storage = {
  [KEY]?: StorageValue;
};

export type Changes = {
  [KEY]?: {
    newValue: StorageValue;
  };
};

// app setting
export type App = {
  name: string;
  value: string;
  disabled: boolean;
};

export type ApplicationRule = {
  blockResourceRules: RegExp[];
  entrypoints: string[];
  ajaxRules: AjaxRule[];
  staticResourceRules: StaticResourceRule[];
  mainFrameText?: string;
};

export type Generate = (
  graphQLPlugin: StorageValue,
  isFirstExecution: boolean
) => Promise<ApplicationRule>;

// rule
export type AjaxRule = {
  filter: (request: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: BodyInit;
  }) => boolean;
  modifyRequest?: (request: {
    method: string;
    url: string;
    headers: Record<string, string>;
  }) => {
    url?: string;
    headers?: Record<string, string>;
    delay?: number;
  };
  modifyResponse?: (response?: any) => string;
  type?: TYPE;
  statusCode?: number;
};

export type StaticResourceRule = {
  filter: (url: string) => boolean;
  target: (url: string) => string;
};

export type Rules = {
  ajaxRules: AjaxRule[];
  staticResourceRules: StaticResourceRule[];
};

export type ResponseSetting = {
  type?: TYPE;
  operationName?: string;
  method?: METHOD;
  responseText?: string;
  statusCode?: string;
};

// message
export type Message = {
  key: StorageKey;
  value: Partial<StorageValue>;
  pageLoad: boolean;
};

// enum
export enum TYPE {
  GraphQL = 'graphql',
  RESTFUL = 'RESTful',
}

export enum METHOD {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
}

declare global {
  interface Window {
    graphQLPlugin?: {
      blockObserver?: MutationObserver;
    };
    ignoreClassName: boolean;
  }
}
