import { License } from "./LicenseTypes";

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
