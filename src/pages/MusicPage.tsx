import {
  IonContent,
  IonFooter,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Song, songs } from "../data/songs";
import { useState } from "react";
import PlayControl from "../components/PlayControl";
import { PreferenceKeys } from "../utils/preferencesUtils";
import PlayList from "../components/PlayList";
import { SearchBar } from "../components/SearchBar";

const MusicPage: React.FC = () => {
  const ASSETS_MUSIC_PATH = "/assets/music/";
  const MUSIC_SEARCH_PLACEHOLDER = "Search by name, artist or tag";
  const [filteredSongs, setFilteredSongs] = useState(
    JSON.parse(JSON.stringify(songs))
  );
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Music</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <SearchBar
            songs={songs}
            setFilteredSongs={setFilteredSongs}
            searchPlaceHolder={MUSIC_SEARCH_PLACEHOLDER}
          />
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Music</IonTitle>
          </IonToolbar>
        </IonHeader>
        <PlayList
          filteredSongs={filteredSongs}
          selectedSong={selectedSong}
          setSelectedSong={setSelectedSong}
          preferenceKey={PreferenceKeys.SELECTED_SONG}
        />
      </IonContent>

      <IonFooter translucent={true}>
        <PlayControl
          id="0"
          path={ASSETS_MUSIC_PATH}
          type="music"
          {...selectedSong}
        />
      </IonFooter>
    </IonPage>
  );
};

export default MusicPage;
