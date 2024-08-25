import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import VolumeSlider from "../components/VolumeSlider";

const MixerPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mixer</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Mixer</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* main content */}
        <IonListHeader>
          <IonLabel>Volume</IonLabel>
        </IonListHeader>
        <IonList>
          <VolumeSlider id="music" label="Music" />
          <VolumeSlider id="effect" label="Effect" />
        </IonList>
        <IonListHeader>
          <IonLabel>FX</IonLabel>
        </IonListHeader>
        <IonList>
          <IonItem>
            <IonToggle justify="space-between" alignment="center">
              Crossfade
            </IonToggle>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default MixerPage;
