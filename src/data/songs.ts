import { v4 as uuidv4 } from "uuid";
import { License, cc_by_4_0_international, cc_by_3_0 } from "./licenses";

export interface Song {
  id: string;
  name: string;
  artist: string;
  album?: string;
  image?: string;
  source: string;
  tags: string[];
  description?: string;
  license: License;
}

export const songs: Song[] = [
  {
    id: uuidv4(),
    name: "Dreamy Piano Melodies",
    artist: "UNIVERSIFIELD",
    album: "Calm Music",
    image: "universifield-dreamy-piano-melodies-cover.jpeg",
    source: "universifield--dreamy-piano-melodies.mp3",
    tags: ["piano", "instrumental"],
    description:
      "This is a soothing piece that evokes serenity and tranquility through its gentle piano melodies. Perfect for relaxation, meditation, and sleep aids, this track creates a peaceful and dreamy atmosphere.",
    license: cc_by_4_0_international,
  },
  {
    id: uuidv4(),
    name: "Played By Ear (Meaningless Rich World)",
    artist: "Jangwa",
    album: "A Guitar In A Bedroom",
    image: "jangwa-played-by-ear-cover.jpeg",
    source: "jangwa--played-by-ear-meaningless-rich-world.mp3",
    tags: ["guitar", "instrumental", "acoustic"],
    license: cc_by_4_0_international,
  },
  {
    id: uuidv4(),
    name: "Guitarista",
    artist: "Mr Smith",
    album: "Guitarista",
    image: "mr-smith-guitarista-cover.jpeg",
    source: "mr-smith--guitarista.mp3",
    tags: ["guitar", "instrumental", "chillout", "soundtrack"],
    license: cc_by_4_0_international,
  },
  {
    id: uuidv4(),
    name: "Fire Tree (Violin Version)",
    artist: "Axletree",
    album: "Music from a Hampshire Farm",
    image: "axletree-fire-tree-violin-version-cover.jpeg",
    source: "axletree--fire-tree-violin-version.mp3",
    tags: ["guitar", "instrumental", "ambient", "classical", "acoustic"],
    description:
      "A new version of my old piece Fire Tree, with additional violin accompaniment.",
    license: cc_by_4_0_international,
  },
  {
    id: uuidv4(),
    name: "Smoothie",
    artist: "Popoi",
    image: "popoi-smoothie-cover.jpeg",
    source: "popoi--smoothie.mp3",
    tags: ["piano", "chillout", "hip-hop", "lo-fi", "instrumental", "beat"],
    description:
      "This melody came to my mind while enjoying a smoothie with my family at lunch, in a warm Sunday :)",
    license: cc_by_4_0_international,
  },
  {
    id: uuidv4(),
    name: "Night on the Docks - Sax",
    artist: "Kevin MacLeod",
    album: "Jazz Sampler",
    image: "kevin-macleod-night-on-the-docks-sax-cover.jpeg",
    source: "kevin-macleod--night-on-the-docks-sax.mp3",
    tags: ["saxophone", "jazz", "instrumental"],
    license: cc_by_3_0,
  },
];
