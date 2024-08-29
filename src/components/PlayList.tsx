import { useEffect } from "react";
import {
  loadPreference,
  PreferenceKeys,
  savePreference,
} from "../utils/preferenceUtils";
import { Song } from "../types";
import { IonList } from "@ionic/react";
import SongCard from "./SongCard";

export interface PlayListProps {
  filtered: Song[];
  selected: Song | null;
  preferenceKey: PreferenceKeys;
  setSelected: React.Dispatch<React.SetStateAction<Song | null>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlayList: React.FC<PlayListProps> = ({
  filtered,
  selected,
  preferenceKey,
  setSelected,
  setIsPlaying,
}) => {
  const handleSelectSong = (id: string) => {
    const filteredSong = filtered.find((song: Song) => song.id === id);
    const selected = JSON.parse(JSON.stringify(filteredSong));
    setSelected(selected);
    setIsPlaying(true);
    console.log("The song was selected to play: " + selected.name);
  };

  useEffect(() => {
    const loadSelectedSong = async () => {
      // Load the saved selected song from storage when the app starts
      const savedSong: Song | null = await loadPreference<Song>(preferenceKey);
      if (savedSong) {
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

  useEffect(() => {
    // Save the selected media whenever it changes
    if (selected) {
      savePreference<Song>(preferenceKey, selected);
    }
  }, [selected]);

  return (
    <IonList>
      {filtered.map((song: Song) => (
        <SongCard key={song.id} song={song} onSelect={handleSelectSong} />
      ))}
    </IonList>
  );
};

export default PlayList;
