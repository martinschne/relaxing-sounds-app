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
import { useState } from "react";
import PlayControl from "../components/PlayControl";
import { v4 as uuidv4 } from "uuid";

const MusicPage: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [filteredSongs, setFilteredSongs] = useState(
    JSON.parse(JSON.stringify(songs))
  );
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

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

  const songWasSelected = selectedSong !== null;

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

      {songWasSelected && (
        <IonFooter translucent={true}>
          <PlayControl {...selectedSong} />
        </IonFooter>
      )}
    </IonPage>
  );
};

export default MusicPage;
