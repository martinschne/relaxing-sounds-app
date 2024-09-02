import {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { Settings } from "../types";
import { loadPreference, savePreference } from "../utils";
import { songs } from "../data/songs";
import { sounds } from "../data/sounds";

export type StateAction<T> = React.Dispatch<React.SetStateAction<T>>;

interface GlobalContextType {
  settings: Settings;
  setSettings: StateAction<Settings>;
}

export const GlobalContext = createContext<GlobalContextType | null>(null);

// define context provider as a wrapping component
export const GlobalContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const DEFAULT_SETTINGS: Settings = {
    musicVolume: 1.0,
    soundVolume: 1.0,
    duration: "nonstop",
    playWhenLocked: true,
    language: "english",
    theme: "system",
    selectedSong: songs[0],
    selectedSound: sounds[0],
  };

  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const loadSettings = async () => {
      const loadedSettings = (await loadPreference("settings")) as Settings;
      if (loadedSettings !== null) {
        console.log("Settings are loaded now" + JSON.stringify(loadedSettings));
        setSettings(loadedSettings);
      } else {
        console.log("$$ GCP: settings are not loaded when not saved yet");
        setSettings(DEFAULT_SETTINGS);
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
    const saveSettings = async () => {
      await savePreference("settings", settings);
    };

    saveSettings().then(() => {
      console.log("$$ GCP settings saved: " + JSON.stringify(settings));
    });
  }, [settings]);

  return (
    <GlobalContext.Provider
      value={{
        settings,
        setSettings,
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
