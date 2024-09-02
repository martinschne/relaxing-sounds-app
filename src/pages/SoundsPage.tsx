import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { SettingsKeys } from "../types";
import { sounds } from "../data/sounds";
import { useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { IonFooter } from "@ionic/react";
import PlayList from "../components/PlayList";
import PlayControl from "../components/PlayControl";
import { useGlobalContext } from "../providers/GlobalContextProvider";

const SoundsPage: React.FC = () => {
  const ASSETS_SOUNDS_PATH = "/assets/sounds/";
  const EFFECTS_SEARCH_PLACEHOLDER = "Search by name, description or tag";

  const [filteredSounds, setFilteredSounds] = useState(
    JSON.parse(JSON.stringify(sounds))
  );
  const { settings } = useGlobalContext();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <IonPage>
      <IonHeader id="header">
        <IonToolbar>
          <IonTitle>Sounds</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <SearchBar
            songs={sounds}
            setFilteredSongs={setFilteredSounds}
            searchPlaceHolder={EFFECTS_SEARCH_PLACEHOLDER}
          />
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Sounds</IonTitle>
          </IonToolbar>
        </IonHeader>
        <PlayList
          filteredTracks={filteredSounds}
          selectedTrackKey={SettingsKeys.SELECTED_SOUND}
          setIsPlaying={setIsPlaying}
        />
      </IonContent>
      <IonFooter id="soundFooter">
        <PlayControl
          track={settings.selectedSound}
          path={ASSETS_SOUNDS_PATH}
          play={isPlaying}
          volumeTypeKey={SettingsKeys.SOUND_VOLUME}
        />
      </IonFooter>
    </IonPage>
  );
};

export default SoundsPage;
