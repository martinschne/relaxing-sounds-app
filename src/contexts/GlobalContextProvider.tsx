import { useState, createContext, useContext, ReactNode } from "react";
import { formatVolume } from "../utils";
import { Percentage, AudioObject, TrackTypes } from "../types";

export type StateAction<T> = React.Dispatch<React.SetStateAction<T>>;

interface GlobalContextType {
  musicAudio: AudioObject;
  effectAudio: AudioObject;
  setMusicAudio: StateAction<AudioObject>;
  setEffectAudio: StateAction<AudioObject>;
  musicVolumePercentage: Percentage | null;
  effectVolumePercentage: Percentage | null;
  setMusicVolumePercentage: StateAction<Percentage | null>;
  setEffectVolumePercentage: StateAction<Percentage | null>;
  adjustVolume: (type: TrackTypes, volume: Percentage | null) => void;
}

export const GlobalContext = createContext<GlobalContextType | null>(null);

// define context provider as a wrapping component
export const GlobalContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [musicAudio, setMusicAudio] = useState<AudioObject>(null);
  const [effectAudio, setEffectAudio] = useState<AudioObject>(null);

  const [musicVolumePercentage, setMusicVolumePercentage] =
    useState<Percentage | null>(null);
  const [effectVolumePercentage, setEffectVolumePercentage] =
    useState<Percentage | null>(null);

  const adjustVolume = (type: TrackTypes, volume: Percentage | null) => {
    if (volume === null) {
      return;
    }
    const volumeSet = formatVolume(volume);
    const audioObject = type === "music" ? musicAudio : effectAudio;

    console.log(`$$ adjustVolume: volumeSet for ${type} is ${volumeSet}`);
    console.log(
      `$$ adjustVolume: audio object for ${type} is ${JSON.stringify(
        audioObject
      )}`
    );

    if (audioObject !== null) {
      if (audioObject instanceof HTMLAudioElement) {
        audioObject.volume = volumeSet;
      } else {
        audioObject.setVolume(volumeSet);
      }
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        musicAudio,
        setMusicAudio,
        effectAudio,
        setEffectAudio,
        musicVolumePercentage,
        setMusicVolumePercentage,
        effectVolumePercentage,
        setEffectVolumePercentage,
        adjustVolume,
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
