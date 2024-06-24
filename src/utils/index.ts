import { DEFAULT_APPLICATION_RULE } from "./constant";
import { handleMessageEvent, openComponentInEditor } from "./utils";
import { Generate } from "./types";


const generateRules: Generate = async (
  graphQLPluginSetting
) => {
  if (graphQLPluginSetting?.pluginSwitchOn) {
    openComponentInEditor();
  }
  return { ...DEFAULT_APPLICATION_RULE };
};

const main = () => {
  handleMessageEvent(generateRules);
};

main();
