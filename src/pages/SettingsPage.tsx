import {
  IonAlert,
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import VolumeSlider from "../components/VolumeSlider";
import { useGlobalContext } from "../providers/GlobalContextProvider";
import { SettingsKeys } from "../types";
import { useTranslation } from "react-i18next";
import { warning } from "ionicons/icons";

const SettingsPage: React.FC = () => {
  const { settings, saveSettings, resetSettings } = useGlobalContext();
  const { t } = useTranslation();

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
    saveSettings(SettingsKeys.THEME, selectedTheme);
  };

  const handleResetSettings = () => {
    resetSettings();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t("label.settings")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonListHeader>
            <IonLabel>{t("settings.playback.header")}</IonLabel>
          </IonListHeader>
          <IonItem lines="none">
            <VolumeSlider
              label={t("settings.playback.label.music")}
              volume={settings.musicVolume}
              onVolumeChange={handleMusicVolumeChange}
            />
          </IonItem>
          <IonItem lines="none">
            <VolumeSlider
              label={t("settings.playback.label.sound")}
              volume={settings.soundVolume}
              onVolumeChange={handleSoundVolumeChange}
            />
          </IonItem>
          <IonItem>
            <IonSelect
              label={t("settings.playback.label.duration")}
              justify="space-between"
              aria-label="duration"
              placeholder={t("settings.playback.durationSelect.placeholder")}
              interface="popover"
              value={settings.duration}
              onIonChange={handleDurationChange}
            >
              <IonSelectOption value="5">
                {t("settings.playback.durationSelect.option.5")}
              </IonSelectOption>
              <IonSelectOption value="15">
                {t("settings.playback.durationSelect.option.15")}
              </IonSelectOption>
              <IonSelectOption value="30">
                {t("settings.playback.durationSelect.option.30")}
              </IonSelectOption>
              <IonSelectOption value="60">
                {t("settings.playback.durationSelect.option.60")}
              </IonSelectOption>
              <IonSelectOption value="Infinity">
                {t("settings.playback.durationSelect.option.nonstop")}
              </IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>
        <IonList>
          <IonListHeader>
            <IonLabel>{t("settings.app.header")}</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonSelect
              label={t("settings.app.label.language")}
              justify="space-between"
              aria-label="language"
              placeholder={t("settings.app.languageSelect.placeholder")}
              interface="popover"
              value={settings.language}
              onIonChange={handleLanguageChange}
            >
              <IonSelectOption value="english">
                {t("settings.app.languageSelect.option.en")}
              </IonSelectOption>
              <IonSelectOption value="german">
                {t("settings.app.languageSelect.option.de")}
              </IonSelectOption>
              <IonSelectOption value="swedish">
                {t("settings.app.languageSelect.option.sv")}
              </IonSelectOption>
              <IonSelectOption value="spanish">
                {t("settings.app.languageSelect.option.es")}
              </IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonSelect
              label={t("settings.app.label.theme")}
              justify="space-between"
              aria-label="theme"
              placeholder={t("settings.app.themeSelect.placeholder")}
              interface="popover"
              value={settings.theme}
              onIonChange={handleThemeChange}
            >
              <IonSelectOption value="system">
                {t("settings.app.themeSelect.option.system")}
              </IonSelectOption>
              <IonSelectOption value="light">
                {t("settings.app.themeSelect.option.light")}
              </IonSelectOption>
              <IonSelectOption value="dark">
                {t("settings.app.themeSelect.option.dark")}
              </IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButton
            id="reset-alert"
            className="ion-margin"
            expand="block"
            color="danger"
          >
            {t("settings.reset.buttonLabel")}
          </IonButton>
          <IonAlert
            trigger="reset-alert"
            header={t("settings.reset.alert.header")}
            className="custom-alert"
            buttons={[
              {
                text: t("common.label.cancel"),
                role: "cancel",
              },
              {
                text: t("common.label.yes"),
                role: "confirm",
                handler: resetSettings,
              },
            ]}
          ></IonAlert>
          <IonTitle size="small">
            <IonText color="medium">
              <IonIcon icon={warning}></IonIcon>
              {t("settings.footNote")}
            </IonText>
          </IonTitle>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default SettingsPage;
