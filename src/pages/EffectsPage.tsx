import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Song } from "../types";
import { effects } from "../data/effects";
import { useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { PreferenceKeys } from "../utils/preferenceUtils";
import { IonFooter } from "@ionic/react";
import PlayList from "../components/PlayList";
import PlayControl from "../components/PlayControl";

const EffectsPage: React.FC = () => {
  const ASSETS_EFFECTS_PATH = "/assets/effects/";
  const EFFECTS_SEARCH_PLACEHOLDER = "Search by name, description or tag";

  const [filteredEffects, setFilteredEffects] = useState(
    JSON.parse(JSON.stringify(effects))
  );
  const [selectedEffect, setSelectedEffect] = useState<Song | null>(null);

  return (
    <IonPage>
      <IonHeader id="header">
        <IonToolbar>
          <IonTitle>Effects</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <SearchBar
            songs={effects}
            setFilteredSongs={setFilteredEffects}
            searchPlaceHolder={EFFECTS_SEARCH_PLACEHOLDER}
          />
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Effects</IonTitle>
          </IonToolbar>
        </IonHeader>
        <PlayList
          filteredSongs={filteredEffects}
          selectedSong={selectedEffect}
          setSelectedSong={setSelectedEffect}
          preferenceKey={PreferenceKeys.SELECTED_EFFECT}
        />
      </IonContent>
      <IonFooter id="effectFooter">
        <PlayControl
          id="0"
          path={ASSETS_EFFECTS_PATH}
          type="effect"
          {...selectedEffect}
        />
      </IonFooter>
    </IonPage>
  );
};

export default EffectsPage;
