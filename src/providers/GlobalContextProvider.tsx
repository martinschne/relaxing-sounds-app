import {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Settings, SettingsKeys } from "../types";
import { PreferencesService } from "../services/PreferencesService";
import { songs } from "../data/songs";
import { sounds } from "../data/sounds";
import i18next from "i18next";
import { Device } from "@capacitor/device";

export type StateAction<T> = React.Dispatch<React.SetStateAction<T>>;

interface GlobalContextType {
  settings: Settings;
  saveSettings: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
}

export const GlobalContext = createContext<GlobalContextType | null>(null);

export const GlobalContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const DEFAULT_SETTINGS: Settings = {
    musicVolume: 1.0,
    soundVolume: 1.0,
    duration: "Infinity",
    language: "system",
    systemLanguage: i18next.resolvedLanguage ?? "en",
    theme: "system",
    selectedSong: songs[0],
    selectedSound: sounds[0],
  };

  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loadPreferencesComplete, setLoadPreferencesComplete] = useState(false);

  const saveSettings = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings((prevSettings) => {
      return {
        ...prevSettings,
        [key]: value,
      };
    });
  };

  const resetSettings = () => {
    setSettings({
      ...DEFAULT_SETTINGS,
      systemLanguage: settings.systemLanguage,
    });
    i18next.changeLanguage(settings.systemLanguage);
  };

  const savePreferences = async () => {
    console.log("Saved preferences: " + JSON.stringify(settings));
    await PreferencesService.savePreference("settings", settings);
  };

  useEffect(() => {
    const loadSettings = async () => {
      const loadedSettings = (await PreferencesService.loadPreference(
        "settings"
      )) as Settings;
      if (loadedSettings !== null) {
        setSettings((prevSettings) => {
          return {
            ...prevSettings,
            ...loadedSettings,
          };
        });
      } else {
        setSettings((prevSettings) => {
          return {
            ...prevSettings,
            ...DEFAULT_SETTINGS,
          };
        });
      }
    };

    const checkSystemLanguageChange = async () => {
      const newLanguageCode = await Device.getLanguageCode();
      console.log(
        "checkSystemLanguageChange: newLang is: " + newLanguageCode.value
      );

      // if (SUPPORTED_LANGUAGES.includes(newLanguageCode.value)) {
      //   saveSettings(SettingsKeys.SYSTEM_LANGUAGE, newLanguageCode.value);
      // } else {
      //   // apply fallback if the system lang is not implemented
      //   if (settings.language === "system") {
      //     saveSettings(SettingsKeys.SYSTEM_LANGUAGE, FALLBACK_LANGUAGE);
      //   }
      // }
      saveSettings(SettingsKeys.SYSTEM_LANGUAGE, newLanguageCode.value);
    };

    loadSettings()
      .then(() => setLoadPreferencesComplete(true))
      .then(checkSystemLanguageChange)
      .then(savePreferences)
      .catch((error) => {
        console.error("Error during settings initialization:", error);
      });
  }, []);

  // continue saving changed preferences after the initial preferences were loaded
  useEffect(() => {
    if (loadPreferencesComplete) {
      savePreferences().then(() => {
        console.log("$$ GCP settings saved: " + JSON.stringify(settings));
      });
    }
  }, [settings]);

  useEffect(() => {
    if (settings.language === "system") {
      i18next.changeLanguage(settings.systemLanguage);
    } else {
      i18next.changeLanguage(settings.language);
    }

    // if system language was switched to manually chosen language
    // activate system language for app
    if (settings.systemLanguage === settings.language) {
      saveSettings(SettingsKeys.LANGUAGE, "system");
    }
  }, [settings.language, settings.systemLanguage]);

  return (
    <GlobalContext.Provider
      value={{
        settings,
        saveSettings,
        resetSettings,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  }
  return context;
};
