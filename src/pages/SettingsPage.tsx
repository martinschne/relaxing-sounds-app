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
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import VolumeSlider from "../components/VolumeSlider";
import { useGlobalContext } from "../providers/GlobalContextProvider";
import { SettingsKeys } from "../types";
import { useTranslation } from "react-i18next";
import { lockClosed, lockOpen, warning } from "ionicons/icons";
import i18next from "i18next";
import { FALLBACK_LANGUAGE, SUPPORTED_LANGUAGES } from "../i18n";
import FooterNote from "../components/FooterNote";

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
    let selectedLanguage = event.detail.value;
    saveSettings(SettingsKeys.LANGUAGE, selectedLanguage);

    if (selectedLanguage === "system") {
      i18next.changeLanguage(settings.systemLanguage);
    } else {
      i18next.changeLanguage(selectedLanguage);
    }
  };

  const handleFollowSystemThemeToggle = (
    event: React.MouseEvent<HTMLIonIconElement, MouseEvent>
  ) => {
    console.warn("Icon clicked !");
    console.warn(
      "followSystemTheme icon clicked, the negated value to save is: " +
        !settings.followSystemTheme
    );
    const followSystemTheme = !settings.followSystemTheme;
    saveSettings(SettingsKeys.FOLLOW_SYSTEM_THEME, followSystemTheme);
  };

  const handleDarkModeChange = (event: CustomEvent) => {
    console.warn("Switcher clicked !");
    const isDarkModeActive = event.detail.checked;
    saveSettings(SettingsKeys.DARK_MODE_ACTIVE, isDarkModeActive);
  };

  const handleResetSettings = () => {
    resetSettings();
  };

  const isSystemLanguageActive = settings.language === "system";
  const isSystemLanguageSupported = SUPPORTED_LANGUAGES.includes(
    settings.systemLanguage
  );
  const selectedSystemLanguageCode = isSystemLanguageSupported
    ? settings.systemLanguage
    : FALLBACK_LANGUAGE;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t("label.settings")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonListHeader>
          <IonLabel>{t("settings.playback.header")}</IonLabel>
        </IonListHeader>
        <IonList inset className="custom-list-background">
          <IonItem lines="none" color="light">
            <VolumeSlider
              label={t("settings.playback.label.music")}
              volume={settings.musicVolume}
              onVolumeChange={handleMusicVolumeChange}
            />
          </IonItem>
          <IonItem lines="none" color="light">
            <VolumeSlider
              label={t("settings.playback.label.sound")}
              volume={settings.soundVolume}
              onVolumeChange={handleSoundVolumeChange}
            />
          </IonItem>
          <IonItem color="light">
            <IonSelect
              label={t("settings.playback.label.duration")}
              justify="space-between"
              aria-label={t("settings.playback.label.duration")}
              placeholder={t("settings.playback.durationSelect.placeholder")}
              interface="action-sheet"
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
        <IonListHeader>
          <IonLabel>{t("settings.app.header")}</IonLabel>
        </IonListHeader>
        <IonList inset>
          <IonItem color="light">
            <IonSelect
              label={t("settings.app.label.language")}
              justify="space-between"
              aria-label={t("settings.app.label.language")}
              placeholder={t("settings.app.languageSelect.placeholder")}
              interface="alert"
              value={settings.language}
              onIonChange={handleLanguageChange}
            >
              <IonSelectOption value={"system"}>
                {t("settings.app.languageSelect.option.system")} -{" "}
                {t(
                  "settings.app.languageSelect.option." +
                    selectedSystemLanguageCode
                )}
                {!isSystemLanguageSupported && <sup> *</sup>}
              </IonSelectOption>
              {SUPPORTED_LANGUAGES.map(
                (language, index) =>
                  language !== settings.systemLanguage && (
                    <IonSelectOption key={index} value={language}>
                      {t(`settings.app.languageSelect.option.${language}`)}
                    </IonSelectOption>
                  )
              )}
            </IonSelect>
          </IonItem>
          <IonItem color="light" style={{ position: "relative" }}>
            <IonToggle
              disabled={settings.followSystemTheme}
              checked={settings.darkModeActive}
              onIonChange={handleDarkModeChange}
              justify="space-between"
            >
              {t("settings.app.label.darkMode")}
            </IonToggle>
            <IonIcon
              icon={settings.followSystemTheme ? lockClosed : lockOpen}
              color="medium"
              style={{
                height: "27px",
                width: "27px",
                position: "absolute",
                right: "75px",
                top: "50%",
                transform: "translateY(-50%)",
                paddingLeft: "15px",
                paddingRight: "15px",
                zIndex: 10,
              }}
              onClick={(event) => {
                event.stopPropagation();
                handleFollowSystemThemeToggle(event);
              }}
            />
          </IonItem>
        </IonList>
        {!isSystemLanguageSupported && isSystemLanguageActive && (
          <div className="ion-padding-horizontal">
            <IonNote color="medium">
              {<sup>*</sup>} We don't support your system language yet.
            </IonNote>
          </div>
        )}
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
                handler: handleResetSettings,
              },
            ]}
          ></IonAlert>
          <FooterNote>
            <IonIcon icon={warning}></IonIcon>
            {t("settings.footNote")}
          </FooterNote>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default SettingsPage;
