import {
  IonContent,
  IonFooter,
  IonHeader,
  IonLabel,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

const MorePage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>About</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">About</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonText>
            <p>
              Combine music & sound effects into relaxing playback. Use the app
              for studying, meditation, sleeping or masking a sound.
            </p>
            <p>Enjoy the moment of tranquility! 🍀</p>
          </IonText>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default MorePage;
