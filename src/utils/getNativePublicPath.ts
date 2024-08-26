import { Capacitor } from "@capacitor/core";

export const getNativePublicPath = (webPath: string) => {
  if (Capacitor.isNativePlatform()) {
    return `file:///android_asset/public${webPath}`;
  }
  return webPath;
};
