import { Preferences } from "@capacitor/preferences";

export class PreferencesService {
  static savePreference = async <T>(key: string, val: T): Promise<void> => {
    await Preferences.set({
      key,
      value: JSON.stringify(val),
    });
  };

  static loadPreference = async <T>(key: string): Promise<T | null> => {
    const { value } = await Preferences.get({ key });
    return value ? JSON.parse(value) : null;
  };

  // NOTE: implement reset settings feature using this method
  static removePreference = async (key: string): Promise<void> => {
    await Preferences.remove({ key });
  };
}
