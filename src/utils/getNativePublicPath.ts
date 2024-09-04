import { Capacitor } from "@capacitor/core";

export const getNativePublicPath = (webPath: string) => {
  if (Capacitor.getPlatform() === "android") {
    return `file:///android_asset/public${webPath}`;
  }
  return webPath;
};
