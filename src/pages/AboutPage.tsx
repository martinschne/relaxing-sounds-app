import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useState } from "react";
import CreditsModal from "../components/CreditsModal";

const MorePage: React.FC = () => {
  const [creditsModalOpen, setCreditsModalOpen] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>About</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <h3>Relaxing Sounds</h3>
        <p>
          Combine music & sound effects into relaxing playback. Use the app for
          studying, meditation, sleeping or masking a sound.
        </p>

        <h4>Tutorial</h4>
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
            Adjust volume, duration of playback and more in <em>Settings</em>{" "}
            tab
          </li>
        </ol>
        <p>Enjoy the moment of tranquility! 🍀</p>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButton
            className="ion-margin"
            id="credits-modal-trigger"
            expand="block"
            color="light"
          >
            View Credits
          </IonButton>
          <IonButton
            className="ion-margin"
            expand="block"
            href="https://github.com/martinschne/relaxing-sounds-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source Code
          </IonButton>
          <IonTitle size="small">
            <IonText color="medium">
              <p>
                Source code is publicly available on Github.
                <br />
                Credits for media used belong to respective authors.
              </p>
            </IonText>
          </IonTitle>
        </IonToolbar>
      </IonFooter>
      <CreditsModal />
    </IonPage>
  );
};

export default MorePage;
