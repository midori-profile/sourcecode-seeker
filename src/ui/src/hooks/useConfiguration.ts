
import { useCallback } from 'react';
import { DEFAULT_CONFIGURATION, KEY } from '../../../utils/constant';
import { StorageValue } from '../../../utils/types';

export const getConfigurationFromStorage = () => {
    const storedValueStr = window.localStorage.getItem(KEY) ?? "";
    try {
      return JSON.parse(storedValueStr) as StorageValue;
    } catch (error) {
      return null;
    }
  };

export const getConfigurationFromUrl = () => {
    try {
      return JSON.parse(
        decodeURIComponent(
          new URLSearchParams(window.location.search).get("configuration") ?? ""
        )
      ) as StorageValue;
    } catch (error) {
      return null;
    }
  };

