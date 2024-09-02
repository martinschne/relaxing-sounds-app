import {
  IonContent,
  IonFooter,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { songs } from "../data/songs";
import { PlaybackSettingKeys } from "../types";
import { useState } from "react";
import PlayControl from "../components/PlayControl";
import PlayList from "../components/PlayList";
import { SearchBar } from "../components/SearchBar";
import { useGlobalContext } from "../providers/GlobalContextProvider";

const MusicPage: React.FC = () => {
  const ASSETS_MUSIC_PATH = "/assets/music/";
  const MUSIC_SEARCH_PLACEHOLDER = "Search by name, artist or tag";

  const [filteredSongs, setFilteredSongs] = useState(
    JSON.parse(JSON.stringify(songs))
  );
  const { settings } = useGlobalContext();
  const [isPlaying, setIsPlaying] = useState(false);

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
          filteredTracks={filteredSongs}
          selectedTrackKey={PlaybackSettingKeys.SELECTED_SONG}
          setIsPlaying={setIsPlaying}
        />
      </IonContent>
      <IonFooter id="musicFooter">
        <PlayControl
          track={settings.selectedSong}
          path={ASSETS_MUSIC_PATH}
          play={isPlaying}
          volumeTypeKey={PlaybackSettingKeys.MUSIC_VOLUME}
        />
      </IonFooter>
    </IonPage>
  );
};

export default MusicPage;
