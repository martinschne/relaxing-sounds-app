import {
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonPicker,
  IonPickerColumn,
  IonPickerColumnOption,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import VolumeSlider from "../components/VolumeSlider";

const SettingsPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonListHeader>
          <IonLabel>Volume</IonLabel>
        </IonListHeader>
        <IonList>
          <VolumeSlider type="music" label="Music" />
          <VolumeSlider type="effect" label="Effect" />
        </IonList>
        <IonListHeader>
          <IonLabel>Playback</IonLabel>
        </IonListHeader>
        <IonList>
          <IonItem>
            <IonSelect
              label="Duration"
              justify="space-between"
              aria-label="duration"
              placeholder="Select duration"
              interface="popover"
              value={"nonstop"}
            >
              <IonSelectOption value="5">5 min</IonSelectOption>
              <IonSelectOption value="15">15 min</IonSelectOption>
              <IonSelectOption value="30">30 min</IonSelectOption>
              <IonSelectOption value="60">60 min</IonSelectOption>
              <IonSelectOption value="nonstop">Nonstop</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonToggle checked justify="space-between" alignment="center">
              Play When Locked
            </IonToggle>
          </IonItem>
        </IonList>
        <IonListHeader>
          <IonLabel>App</IonLabel>
        </IonListHeader>
        <IonList>
          <IonItem>
            <IonSelect
              label="Language"
              justify="space-between"
              aria-label="language"
              placeholder="Select language"
              interface="popover"
              value={"english"}
            >
              <IonSelectOption value="english">English</IonSelectOption>
              <IonSelectOption value="german">German</IonSelectOption>
              <IonSelectOption value="swedish">Swedish</IonSelectOption>
              <IonSelectOption value="spanish">Spanish</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonSelect
              label="Theme"
              justify="space-between"
              aria-label="theme"
              placeholder="Select theme"
              interface="popover"
              value={"system"}
            >
              <IonSelectOption value="system">System</IonSelectOption>
              <IonSelectOption value="light">Light</IonSelectOption>
              <IonSelectOption value="dark">Dark</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
