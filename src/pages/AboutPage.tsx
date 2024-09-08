import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import CreditsModal from "../components/CreditsModal";
import { Trans, useTranslation } from "react-i18next";

const MorePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t("label.about")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <h3>Relaxing Sounds</h3>
        <p>{t("about.appDescription")}</p>

        <h4>{t("about.tutorialHeader")}</h4>
        <Trans i18nKey="about.tutorialSteps">
          <span>
            <ol>
              <li>
                <p>
                  Choose music from <em>Music</em>
                </p>
              </li>
              <li>
                <p>
                  Choose suitable sound from <em>Sounds</em>
                </p>
              </li>
              <li>
                Adjust volume, duration of playback and more in{" "}
                <em>Settings</em> tab
              </li>
            </ol>
            <p>Enjoy the moment of tranquility! 🍀</p>
          </span>
        </Trans>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButton
            className="ion-margin"
            id="credits-modal-trigger"
            expand="block"
            color="light"
          >
            {t("about.buttonLabel.viewCredits")}
          </IonButton>
          <IonButton
            className="ion-margin"
            expand="block"
            href="https://github.com/martinschne/relaxing-sounds-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("about.buttonLabel.sourceCode")}
          </IonButton>
          <IonTitle size="small">
            <IonText color="medium">
              <Trans i18nKey="about.footNote">
                <p>
                  Source code is publicly available on Github.
                  <br />
                  Credits for media used belong to respective authors.
                </p>
              </Trans>
            </IonText>
          </IonTitle>
        </IonToolbar>
      </IonFooter>
      <CreditsModal />
    </IonPage>
  );
};

export default MorePage;
