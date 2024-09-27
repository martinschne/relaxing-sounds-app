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
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

export type StateAction<T> = React.Dispatch<React.SetStateAction<T>>;

interface GlobalContextType {
  appName: string;
  settings: Settings;
  saveSettings: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
}

export const GlobalContext = createContext<GlobalContextType | null>(null);

export const GlobalContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const isDarkModeActive = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const DEFAULT_SETTINGS: Settings = {
    musicVolume: 1.0,
    soundVolume: 1.0,
    duration: "Infinity",
    language: "system",
    systemLanguage: i18next.resolvedLanguage ?? "en",
    darkModeActive: isDarkModeActive,
    followSystemTheme: true,
    selectedSong: songs[0],
    selectedSound: sounds[0],
  };

  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loadPreferencesComplete, setLoadPreferencesComplete] = useState(false);
  const [appName, setAppName] = useState(document.title); // fallbck for web

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
    await PreferencesService.savePreference("settings", settings);
  };

  const toggleDarkPalette = (shouldAdd: boolean) => {
    document.documentElement.classList.toggle("ion-palette-dark", shouldAdd);
  };

  const handleSystemThemeChange = (event: MediaQueryListEvent) => {
    if (settings.followSystemTheme) {
      let isDarkModeActive = event.matches;
      toggleDarkPalette(isDarkModeActive);
      saveSettings(SettingsKeys.DARK_MODE_ACTIVE, isDarkModeActive);
    }
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

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    // Function to apply system's theme if followSystemTheme is true
    const applySystemTheme = () => {
      const isDarkModeActive = prefersDark.matches; // Check current system preference
      toggleDarkPalette(isDarkModeActive); // Apply dark or light mode based on system
      saveSettings(SettingsKeys.DARK_MODE_ACTIVE, isDarkModeActive); // Save new setting
    };

    if (settings.followSystemTheme) {
      applySystemTheme();

      // Add the event listener for system theme changes
      prefersDark.addEventListener("change", handleSystemThemeChange);

      // Clean up the event listener on component unmount
      return () => {
        prefersDark.removeEventListener("change", handleSystemThemeChange);
      };
    }
  }, [settings.followSystemTheme]);

  // continue saving changed preferences after the initial preferences were loaded
  useEffect(() => {
    if (loadPreferencesComplete) {
      savePreferences();
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

  useEffect(() => {
    if (settings.followSystemTheme) {
      return;
    }
    toggleDarkPalette(settings.darkModeActive);
  }, [settings.darkModeActive]);

  useEffect(() => {
    // get name dynamically for native platform
    if (Capacitor.isNativePlatform()) {
      App.getInfo().then((info) => {
        setAppName(info.name);
      });
    }
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        appName,
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
