import { License } from "./LicenseTypes";

export type MediaType = "music" | "effect";

export interface Song {
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
