import { Track } from "./Track";

export interface Settings {
  musicVolume: number;
  soundVolume: number;
  duration: string;
  language: string;
  systemLanguage: string;
  theme: string;
  selectedSong: Track;
  selectedSound: Track;
}
