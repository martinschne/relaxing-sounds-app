import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonSpinner,
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
import SoundsPage from "./pages/SoundsPage";
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
import { GlobalContextProvider } from "./providers/GlobalContextProvider";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";

setupIonicReact();

const App: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Suspense fallback={<IonSpinner />}>
      <IonApp>
        <IonReactRouter>
          <GlobalContextProvider>
            <IonTabs>
              <IonRouterOutlet>
                <Redirect exact path="/" to="/music" />
                <Route path="/music" render={() => <MusicPage />} exact />
                <Route path="/sounds" render={() => <SoundsPage />} exact />
                <Route path="/settings" render={() => <SettingsPage />} exact />
                <Route path="/about" render={() => <AboutPage />} exact />
              </IonRouterOutlet>
              <IonTabBar slot="bottom">
                <IonTabButton tab="music" href="/music">
                  <IonIcon aria-hidden="true" icon={musicalNotesOutline} />
                  <IonLabel>{t("label.music")}</IonLabel>
                </IonTabButton>
                <IonTabButton tab="sounds" href="/sounds">
                  <IonIcon aria-hidden="true" icon={waterOutline} />
                  <IonLabel>{t("label.sounds")}</IonLabel>
                </IonTabButton>
                <IonTabButton tab="settings" href="/settings">
                  <IonIcon aria-hidden="true" icon={optionsOutline} />
                  <IonLabel>{t("label.settings")}</IonLabel>
                </IonTabButton>
                <IonTabButton tab="about" href="/about">
                  <IonIcon aria-hidden="true" icon={informationCircleOutline} />
                  <IonLabel>{t("label.about")}</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </GlobalContextProvider>
        </IonReactRouter>
      </IonApp>
    </Suspense>
  );
};

export default App;
