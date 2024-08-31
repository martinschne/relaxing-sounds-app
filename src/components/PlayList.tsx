import { useEffect } from "react";
import {
  loadPreference,
  PreferenceKeys,
  savePreference,
} from "../utils/preferenceUtils";
import { Track } from "../types";
import { IonList } from "@ionic/react";
import SongCard from "./SongCard";

export interface PlayListProps {
  filtered: Track[];
  preferenceKey: PreferenceKeys;
  setSelected: React.Dispatch<React.SetStateAction<Track | null>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlayList: React.FC<PlayListProps> = ({
  filtered,
  preferenceKey,
  setSelected,
  setIsPlaying,
}) => {
  const saveSelected = async (selected: Track) => {
    if (selected) {
      await savePreference<Track>(preferenceKey, selected);
    }
  };

  const handleSelectSong = async (id: string) => {
    const filteredSong = filtered.find((song: Track) => song.id === id);
    const selected = JSON.parse(JSON.stringify(filteredSong));
    saveSelected(selected);
    setSelected(selected);
    setIsPlaying(true);
    console.log("The song was selected to play: " + selected.name);
  };

  useEffect(() => {
    const loadSelectedSong = async () => {
      // Load the saved selected song from storage when the app starts
      const savedSong: Track | null = await loadPreference<Track>(
        preferenceKey
      );
      if (savedSong !== null) {
        savedSong.id = "0"; // set as preselected song (don't play)
        setSelected(savedSong);
      } else {
        // no previously set song, preselect 1st one
        const preselected = filtered[0];
        preselected.id = "0";
        setSelected(preselected);
      }
    };

    loadSelectedSong();
  }, []);

  return (
    <IonList>
      {filtered.map((song: Track) => (
        <SongCard key={song.id} song={song} onSelect={handleSelectSong} />
      ))}
    </IonList>
  );
};

export default PlayList;
