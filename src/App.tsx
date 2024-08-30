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
  informationCircleOutline,
  musicalNotesOutline,
  optionsOutline,
  waterOutline,
} from "ionicons/icons";
import MusicPage from "./pages/MusicPage";
import EffectsPage from "./pages/EffectsPage";
import SettingsPage from "./pages/SettingsPage";
import AboutPage from "./pages/AboutPage";

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
import { GlobalContextProvider } from "./contexts/GlobalContextProvider";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <GlobalContextProvider>
        <IonTabs>
          <IonRouterOutlet>
            <Redirect exact path="/" to="/music" />
            <Route path="/music" render={() => <MusicPage />} exact={true} />
            <Route
              path="/effects"
              render={() => <EffectsPage />}
              exact={true}
            />
            <Route
              path="/settings"
              render={() => <SettingsPage />}
              exact={true}
            />
            <Route path="/about" render={() => <AboutPage />} exact={true} />
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
            <IonTabButton tab="settings" href="/settings">
              <IonIcon aria-hidden="true" icon={optionsOutline} />
              <IonLabel>Settings</IonLabel>
            </IonTabButton>
            <IonTabButton tab="about" href="/about">
              <IonIcon aria-hidden="true" icon={informationCircleOutline} />
              <IonLabel>About</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </GlobalContextProvider>
    </IonReactRouter>
  </IonApp>
);

export default App;
