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
  IonToolbar,
} from "@ionic/react";
import VolumeSlider from "../components/VolumeSlider";
import { useGlobalContext } from "../providers/GlobalContextProvider";
import { SettingsKeys } from "../types";

const SettingsPage: React.FC = () => {
  const { settings, saveSettings } = useGlobalContext();

  const handleMusicVolumeChange = (event: CustomEvent) => {
    const updatedMusicVolume = event.detail.value;
    saveSettings(SettingsKeys.MUSIC_VOLUME, updatedMusicVolume);
  };

  const handleSoundVolumeChange = (event: CustomEvent) => {
    const updatedSoundVolume = event.detail.value;
    saveSettings(SettingsKeys.SOUND_VOLUME, updatedSoundVolume);
  };

  const handleDurationChange = (event: CustomEvent) => {
    const selectedDuration = event.detail.value;
    saveSettings(SettingsKeys.DURATION, selectedDuration);
  };

  const handleLanguageChange = (event: CustomEvent) => {
    const selectedLanguage = event.detail.value;
    saveSettings(SettingsKeys.LANGUAGE, selectedLanguage);
  };

  const handleThemeChange = (event: CustomEvent) => {
    const selectedTheme = event.detail.value;
    saveSettings(SettingsKeys.LANGUAGE, selectedTheme);
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
            <IonLabel>Playback</IonLabel>
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
              <IonSelectOption value="Infinity">Nonstop</IonSelectOption>
            </IonSelect>
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
