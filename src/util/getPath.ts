import { Capacitor } from "@capacitor/core";

export const getPath = (webPath: string) => {
  if (Capacitor.isNativePlatform()) {
    return `file:///android_asset/public${webPath}`;
  }
  return webPath;
};
