import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  loadPreference,
  PreferenceKeys,
  savePreference,
} from "../utils/preferenceUtils";
import { Song } from "../data/songs";
import { IonList } from "@ionic/react";
import SongCard from "./SongCard";

export interface PlayListProps {
  filteredSongs: Song[];
  selectedSong: Song | null;
  setSelectedSong: React.Dispatch<React.SetStateAction<Song | null>>;
  preferenceKey: PreferenceKeys;
}

const PlayList: React.FC<PlayListProps> = ({
  filteredSongs,
  selectedSong,
  setSelectedSong,
  preferenceKey,
}) => {
  const handleSelectSong = (id: string) => {
    const filteredSong = filteredSongs.find((song: Song) => song.id === id);
    const selected = JSON.parse(JSON.stringify(filteredSong));
    selected.id = uuidv4(); // add new id to trigger component refresh
    setSelectedSong(selected);
  };

  useEffect(() => {
    const loadSelectedSong = async () => {
      // Load the saved selected song from storage when the app starts
      const savedSong: Song | null = await loadPreference<Song>(preferenceKey);
      if (savedSong) {
        savedSong.id = "0"; // set as preselected song (don't play)
        setSelectedSong(savedSong);
      } else {
        // no previously set song, preselect 1st one
        const preselected = filteredSongs[0];
        preselected.id = "0";
        setSelectedSong(preselected);
      }
    };

    loadSelectedSong();
  }, []);

  useEffect(() => {
    // Save the selected song whenever it changes
    if (selectedSong && selectedSong.id !== "0") {
      savePreference<Song>(preferenceKey, selectedSong);
    }
  }, [selectedSong]);

  return (
    <IonList>
      {filteredSongs.map((song: Song) => (
        <SongCard key={song.id} song={song} onSelect={handleSelectSong} />
      ))}
    </IonList>
  );
};

export default PlayList;
