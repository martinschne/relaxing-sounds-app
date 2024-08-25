import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  ellipsisHorizontalOutline,
  musicalNotesOutline,
  optionsOutline,
  waterOutline,
} from "ionicons/icons";
import MusicPage from "./pages/MusicPage";
import EffectsPage from "./pages/EffectsPage";
import MixerPage from "./pages/MixerPage";
import MorePage from "./pages/MorePage";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import { AudioContextProvider } from "./contexts/AudioContextProvider";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <AudioContextProvider>
        <IonTabs>
          <IonRouterOutlet>
            <Redirect exact path="/" to="/music" />
            <Route path="/music" render={() => <MusicPage />} exact={true} />
            <Route
              path="/effects"
              render={() => <EffectsPage />}
              exact={true}
            />
            <Route path="/mixer" render={() => <MixerPage />} exact={true} />
            <Route path="/more" render={() => <MorePage />} exact={true} />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="music" href="/music">
              <IonIcon aria-hidden="true" icon={musicalNotesOutline} />
              <IonLabel>Music</IonLabel>
            </IonTabButton>
            <IonTabButton tab="effects" href="/effects">
              <IonIcon aria-hidden="true" icon={waterOutline} />
              <IonLabel>Effects</IonLabel>
            </IonTabButton>
            <IonTabButton tab="mixer" href="/mixer">
              <IonIcon aria-hidden="true" icon={optionsOutline} />
              <IonLabel>Mixer</IonLabel>
            </IonTabButton>
            <IonTabButton tab="more" href="/more">
              <IonIcon aria-hidden="true" icon={ellipsisHorizontalOutline} />
              <IonLabel>More</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </AudioContextProvider>
    </IonReactRouter>
  </IonApp>
);

export default App;
