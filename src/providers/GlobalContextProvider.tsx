import {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { Settings, SettingsKeys } from "../types";
import { PreferencesService } from "../services/PreferencesService";
import { songs } from "../data/songs";
import { sounds } from "../data/sounds";
import i18next from "i18next";
import { SUPPORTED_LANGUAGES } from "../i18n";

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
    language: i18next.resolvedLanguage ?? "en",
    systemLanguage: i18next.resolvedLanguage ?? "en",
    theme: "system",
    selectedSong: songs[0],
    selectedSound: sounds[0],
  };

  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const isInitialLoad = useRef(true);

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
      language: settings.systemLanguage,
      systemLanguage: settings.systemLanguage,
    });
    i18next.changeLanguage(settings.systemLanguage);
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
            ...loadSettings,
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

    loadSettings();
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) {
      // skip saving on first load
      isInitialLoad.current = false;
      return;
    }
    const savePreferences = async () => {
      await PreferencesService.savePreference("settings", settings);
    };

    savePreferences().then(() => {
      console.log("$$ GCP settings saved: " + JSON.stringify(settings));
    });
  }, [settings]);

  useEffect(() => {
    const handleLanguageChange = () => {
      console.log("$$$ Language change event occurred!!");
      const newLanguage = navigator.language?.substring(0, 2);
      console.log("!!! navigator lang changed to " + newLanguage);

      if (newLanguage && SUPPORTED_LANGUAGES.includes(newLanguage)) {
        saveSettings(SettingsKeys.LANGUAGE, newLanguage);
        saveSettings(SettingsKeys.SYSTEM_LANGUAGE, newLanguage);
        i18next.changeLanguage(newLanguage);
      }
    };

    handleLanguageChange();
  }, []);

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
