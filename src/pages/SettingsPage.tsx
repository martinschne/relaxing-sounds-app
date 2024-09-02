import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import VolumeSlider from "../components/VolumeSlider";
import { useGlobalContext } from "../providers/GlobalContextProvider";

const SettingsPage: React.FC = () => {
  const { settings, setSettings } = useGlobalContext();

  const handleMusicVolumeChange = (event: CustomEvent) => {
    console.log("Music volume CHANGED, now is: " + event.detail.value);
    setSettings((prevSettings) => {
      return {
        ...prevSettings,
        musicVolume: event.detail.value,
      };
    });
  };

  const handleSoundVolumeChange = (event: CustomEvent) => {
    setSettings((prevSettings) => {
      return {
        ...prevSettings,
        soundVolume: event.detail.value,
      };
    });
  };

  const handleDurationChange = (event: CustomEvent) => {
    setSettings((prevSettings) => {
      return {
        ...prevSettings,
        duration: event.detail.value,
      };
    });
  };

  const handlePlayWhenLockedChange = (event: CustomEvent) => {
    setSettings((prevSettings) => {
      return {
        ...prevSettings,
        playWhenLocked: event.detail.checked,
      };
    });
  };

  const handleLanguageChange = (event: CustomEvent) => {
    setSettings((prevSettings) => {
      return {
        ...prevSettings,
        language: event.detail.value,
      };
    });
  };

  const handleThemeChange = (event: CustomEvent) => {
    setSettings((prevSettings) => {
      return {
        ...prevSettings,
        theme: event.detail.value,
      };
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonListHeader>
            <IonLabel>Volume</IonLabel>
          </IonListHeader>
          <IonItem lines="none">
            <VolumeSlider
              label="Music"
              volume={settings.musicVolume}
              onVolumeChange={handleMusicVolumeChange}
            />
          </IonItem>
          <IonItem lines="none">
            <VolumeSlider
              label="Sound"
              volume={settings.soundVolume}
              onVolumeChange={handleSoundVolumeChange}
            />
          </IonItem>
        </IonList>
        <IonList>
          <IonListHeader>
            <IonLabel>Playback</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonSelect
              label="Duration"
              justify="space-between"
              aria-label="duration"
              placeholder="Select duration"
              interface="popover"
              value={settings.duration}
              onIonChange={handleDurationChange}
            >
              <IonSelectOption value="5">5 min</IonSelectOption>
              <IonSelectOption value="15">15 min</IonSelectOption>
              <IonSelectOption value="30">30 min</IonSelectOption>
              <IonSelectOption value="60">60 min</IonSelectOption>
              <IonSelectOption value="nonstop">Nonstop</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonToggle
              justify="space-between"
              alignment="center"
              checked={settings.playWhenLocked}
              onIonChange={handlePlayWhenLockedChange}
            >
              Play When Locked
            </IonToggle>
          </IonItem>
        </IonList>
        <IonList>
          <IonListHeader>
            <IonLabel>App</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonSelect
              label="Language"
              justify="space-between"
              aria-label="language"
              placeholder="Select language"
              interface="popover"
              value={settings.language}
              onIonChange={handleLanguageChange}
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
              value={settings.theme}
              onIonChange={handleThemeChange}
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
