import { License } from "./LicenseTypes";

export enum TrackTypes {
  MUSIC = "music",
  SOUND = "sound",
}

export interface Track {
  id: string;
  name: string;
  artist: string;
  album?: string;
  image?: string;
  source: string;
  url?: string;
  tags: string[];
  description?: string;
  license: License;
}
