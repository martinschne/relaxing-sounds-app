import { Track } from "./Track";

export interface Settings {
  musicVolume: number;
  soundVolume: number;
  duration: string;
  language: string;
  systemLanguage: string;
  darkModeActive: boolean;
  followSystemTheme: boolean;
  selectedSong: Track;
  selectedSound: Track;
}
