import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Track, TrackTypes, PreferenceKeys } from "../types";
import { sounds } from "../data/sounds";
import { useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { IonFooter } from "@ionic/react";
import PlayList from "../components/PlayList";
import PlayControl from "../components/PlayControl";

const SoundsPage: React.FC = () => {
  const ASSETS_SOUNDS_PATH = "/assets/sounds/";
  const EFFECTS_SEARCH_PLACEHOLDER = "Search by name, description or tag";

  const [filteredSounds, setFilteredSounds] = useState(
    JSON.parse(JSON.stringify(sounds))
  );
  const [selectedSound, setSelectedSound] = useState<Track | null>(null);
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
          filtered={filteredSounds}
          preferenceKey={PreferenceKeys.SELECTED_EFFECT}
          setSelected={setSelectedSound}
          setIsPlaying={setIsPlaying}
        />
      </IonContent>
      <IonFooter id="effectFooter">
        <PlayControl
          song={selectedSound}
          path={ASSETS_SOUNDS_PATH}
          type={TrackTypes.SOUND}
          play={isPlaying}
        />
      </IonFooter>
    </IonPage>
  );
};

export default SoundsPage;
