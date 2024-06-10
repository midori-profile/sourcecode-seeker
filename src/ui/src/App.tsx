import React, {
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useUpdate } from "react-use";
import { Switch, Typography, Divider } from "antd";
import { v4 as uuid } from "uuid";
import {
  KEY,
  USER_ID_KEY,
  DEFAULT_CONFIGURATION,
  SWITCH_COOKIE_KEY,
} from "../../utils/constant";
import { getConfigurationFromStorage, getConfigurationFromUrl } from "./hooks/useConfiguration";

const { Text, Paragraph } = Typography;

const isChromeExtensionEnv =
  typeof window.chrome?.storage?.local?.set === "function";

let userId = "";

function App() {
  const forceUpdate = useUpdate();
  const pluginSwitchOnRef = useRef(DEFAULT_CONFIGURATION.pluginSwitchOn);

  const store = useCallback(() => {
    const value = {
      pluginSwitchOn: pluginSwitchOnRef.current,
    };
    if (isChromeExtensionEnv) {
      chrome.storage.local.set({
        [KEY]: value.pluginSwitchOn
          ? { ...value, lastEffectiveTimestamp: Date.now() }
          : value,
      });
    } else {
      window.localStorage.setItem(KEY, JSON.stringify(value));
      document.cookie = `${SWITCH_COOKIE_KEY}=${
        pluginSwitchOnRef.current ? "ON" : "OFF"
      }; path=/; max-age=${60 * 60 * 12}; samesite=strict;`;
    }
  }, []);

  const refreshPage = useCallback(() => {
    const storedValue = getConfigurationFromUrl() ?? getConfigurationFromStorage();

    if (storedValue) {
      pluginSwitchOnRef.current = storedValue.pluginSwitchOn ?? false;
      forceUpdate();
      store();
      window.history.replaceState({}, "", window.location.href.replace(/\?configuration=.+$/g, ""));
    }
  }, [forceUpdate, store]);

  useEffect(() => {
    if (isChromeExtensionEnv) {
      chrome.storage.local.get(USER_ID_KEY, (userIdStorage) => {
        userId = userIdStorage[USER_ID_KEY];

        if (!userId) {
          userId = uuid();
          chrome.storage.local.set({ [USER_ID_KEY]: userId });
        }
      });
      chrome.storage.local.get(KEY, (storage) => {
        if (storage[KEY]) {
          pluginSwitchOnRef.current = storage[KEY].pluginSwitchOn ?? false;
          forceUpdate();
        }
      });
    } else {
      userId = window.localStorage.getItem(USER_ID_KEY) ?? "";
      if (!userId) {
        userId = uuid();
        window.localStorage.setItem(USER_ID_KEY, userId);
      }

      refreshPage();
    }
  }, [refreshPage]);

  useEffect(() => {
    const visibilitychangeHandler = () => {
      if (document.visibilityState === "visible" && !isChromeExtensionEnv) {
        refreshPage();
      }
    };

    document.addEventListener("visibilitychange", visibilitychangeHandler);

    return () => {
      document.removeEventListener("visibilitychange", visibilitychangeHandler);
    };
  }, [refreshPage]);

  return (
    <div className="app" style={{ padding: 24, width: "300px", background: '#fff'}}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Switch
            checked={pluginSwitchOnRef.current}
            onChange={(checked) => {
              pluginSwitchOnRef.current = checked;
              forceUpdate();
              store();
            }}
          />
          <span 
            style={{
              fontSize: '85%',
              fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
              marginLeft: '8px',
              color:  pluginSwitchOnRef.current ? '#343434' : '#ccc',
            }}>
            Enable Source Code Seeker
          </span>
        </div>
        <Divider />
        <Typography>
          <Paragraph>
            In your project, configure <Text code>.babelrc</Text> with:
          </Paragraph>
          <Paragraph>
            <p style={{    
                fontSize: '85%',
                fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
                background: 'rgba(150, 150, 150, 0.1)',
                border: '1px solid rgba(100, 100, 100, 0.2)'}}>
                  "presets": [<br />
                   {' '}[@babel/preset-env", {`{ "targets": "defaults" }`}],<br />
                   {' '}["@babel/preset-react", {`{ "development": true }`}],<br />
                  ]
            </p>
          </Paragraph>
          <Paragraph>
            Then, in <Text code>webpack.config.js</Text>, set <Text code>devtool: "source-map"</Text>. 
          </Paragraph>
          <Paragraph>
            After enabling, open DevTools, hold <Text keyboard>Alt/Option</Text>, and click on a component to jump to the corresponding code. 🎉
          </Paragraph>
        </Typography>
      </div>
    </div>
  );
}

export default App;
