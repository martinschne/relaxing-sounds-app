import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./EffectsPage.css";

const EffectsPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Effects</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Effects</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* main content */}
      </IonContent>
    </IonPage>
  );
};

export default EffectsPage;
