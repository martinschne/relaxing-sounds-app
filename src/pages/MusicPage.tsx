import {
  IonContent,
  IonFooter,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { songs } from "../data/songs";
import { SettingsKeys } from "../types";
import { useState, useTransition } from "react";
import PlayControl from "../components/PlayControl";
import PlayList from "../components/PlayList";
import { SearchBar } from "../components/SearchBar";
import { useGlobalContext } from "../providers/GlobalContextProvider";
import { useTranslation } from "react-i18next";

const MusicPage: React.FC = () => {
  const { t } = useTranslation();

  const ASSETS_MUSIC_PATH = "/assets/music/";
  const MUSIC_SEARCH_PLACEHOLDER = t("musicSearchPlaceholder");

  const [filteredSongs, setFilteredSongs] = useState(
    JSON.parse(JSON.stringify(songs))
  );
  const { settings } = useGlobalContext();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t("label.music")}</IonTitle>
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
            <IonTitle size="large">{t("label.music")}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <PlayList
          filteredTracks={filteredSongs}
          selectedTrackKey={SettingsKeys.SELECTED_SONG}
          setIsPlaying={setIsPlaying}
        />
      </IonContent>
      <IonFooter id="musicFooter">
        <PlayControl
          track={settings.selectedSong}
          path={ASSETS_MUSIC_PATH}
          play={isPlaying}
          volumeTypeKey={SettingsKeys.MUSIC_VOLUME}
        />
      </IonFooter>
    </IonPage>
  );
};

export default MusicPage;
