import { MediaObject } from "@awesome-cordova-plugins/media";
import { useState, createContext, useContext, ReactNode } from "react";
import { formatVolume, Percentage } from "../utils/formatter";

export type audioHandler = MediaObject | HTMLAudioElement | null;
export type stateAction<T> = React.Dispatch<React.SetStateAction<T>>;

interface AudioContextType {
  musicAudio: audioHandler;
  effectAudio: audioHandler;
  setMusicAudio: stateAction<audioHandler>;
  setEffectAudio: stateAction<audioHandler>;
  musicVolumePercentage: Percentage | null;
  effectVolumePercentage: Percentage | null;
  setMusicVolumePercentage: stateAction<Percentage | null>;
  setEffectVolumePercentage: stateAction<Percentage | null>;
  adjustVolume: (type: "music" | "effect", volume: Percentage | null) => void;
}

export const AudioContext = createContext<AudioContextType | null>(null);

// define context provider as a wrapping component
export const AudioContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [musicAudio, setMusicAudio] = useState<audioHandler>(null);
  const [effectAudio, setEffectAudio] = useState<audioHandler>(null);

  const [musicVolumePercentage, setMusicVolumePercentage] =
    useState<Percentage | null>(null);
  const [effectVolumePercentage, setEffectVolumePercentage] =
    useState<Percentage | null>(null);

  const adjustVolume = (
    type: "music" | "effect",
    volume: Percentage | null
  ) => {
    if (volume === null) {
      return;
    }
    const volumeSet = formatVolume(volume);
    const audio = type === "music" ? musicAudio : effectAudio;

    console.log(`$$ adjustVolume: volumeSet for ${type} is ${volumeSet}`);
    console.log(
      `$$ adjustVolume: audio object for ${type} is ${JSON.stringify(audio)}`
    );

    if (audio !== null) {
      if (audio instanceof HTMLAudioElement) {
        audio.volume = volumeSet;
      } else {
        audio.setVolume(volumeSet);
      }
    }
  };

  return (
    <AudioContext.Provider
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
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within a AudioContextProvider");
  }
  return context;
};
