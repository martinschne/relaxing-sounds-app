import {
  IonContent,
  IonFooter,
  IonHeader,
  IonList,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./MusicPage.css";
import { Song, songs } from "../data/songs";
import SongCard from "../components/SongCard";
import { useEffect, useState } from "react";
import PlayControl from "../components/PlayControl";
import { v4 as uuidv4 } from "uuid";
import StorageService from "../services/StorageService";
import {
  loadPreference,
  PreferenceKeys,
  savePreference,
} from "../utils/preferencesUtils";

const MusicPage: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [filteredSongs, setFilteredSongs] = useState(
    JSON.parse(JSON.stringify(songs))
  );

  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  useEffect(() => {
    const loadSelectedSong = async () => {
      // Load the saved selected song from storage when the app starts

      const savedSong: Song | null = await loadPreference<Song>(
        PreferenceKeys.SELECTED_SONG
      );
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
      savePreference<Song>(PreferenceKeys.SELECTED_SONG, selectedSong);
    }
  }, [selectedSong]);

  const handleSearch = (event: CustomEvent) => {
    const query = event.detail.value!.toLowerCase();

    const filteredSongs = songs.filter(
      (song) =>
        song.name.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        song.tags.some((tag) => tag.toLowerCase().includes(query))
    );

    setSearchText(query);
    setFilteredSongs(() => JSON.parse(JSON.stringify(filteredSongs)));
  };

  const handleSelectSong = (id: string) => {
    const filteredSong = filteredSongs.find((song: Song) => song.id === id);
    const selected = JSON.parse(JSON.stringify(filteredSong));
    selected.id = uuidv4(); // add new id to trigger component refresh
    setSelectedSong(selected);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Music</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchText}
            placeholder="Search by song, artist or tag"
            onIonInput={handleSearch}
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Music</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {filteredSongs.map((song: Song) => (
            <SongCard key={song.id} song={song} onSelect={handleSelectSong} />
          ))}
        </IonList>
      </IonContent>

      <IonFooter translucent={true}>
        <PlayControl id="0" {...selectedSong} />
      </IonFooter>
    </IonPage>
  );
};

export default MusicPage;
