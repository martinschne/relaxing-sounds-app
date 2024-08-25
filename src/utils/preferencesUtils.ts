import { Preferences } from "@capacitor/preferences";

export enum PreferenceKeys {
  SELECTED_SONG = "selectedSong",
  SELECTED_EFFECT = "selectedEffect",
  SONG_VOLUME_PERCENTAGE = "songVolumePercentage",
  EFFECT_VOLUME_PERCENTAGE = "effectVolumePercentage",
}

export const savePreference = async <T>(key: string, val: T): Promise<void> => {
  await Preferences.set({
    key,
    value: JSON.stringify(val),
  });
};

export const loadPreference = async <T>(key: string): Promise<T | null> => {
  const { value } = await Preferences.get({ key });
  return value ? JSON.parse(value) : null;
};

export const removePreference = async (key: string): Promise<void> => {
  await Preferences.remove({ key });
};
