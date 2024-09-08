import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonListHeader,
  IonLabel,
  IonNote,
  IonItem,
} from "@ionic/react";
import { useRef, useTransition } from "react";

import { songs } from "../data/songs";
import { sounds } from "../data/sounds";
import Credit from "./Credit";
import { Trans, useTranslation } from "react-i18next";

interface CreditsModalProps {}

const CreditsModal: React.FC<CreditsModalProps> = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const { t } = useTranslation();

  return (
    <>
      <IonModal
        ref={modal}
        trigger="credits-modal-trigger"
        keepContentsMounted={true}
        aria-labelledby={t("creditsModal.header")}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>{t("creditsModal.header")}</IonTitle>
            <IonButtons slot="end">
              <IonButton
                size="default"
                onClick={(event) => {
                  modal.current?.dismiss();
                }}
              >
                {t("common.label.close")}
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonList>
            <IonListHeader lines="inset">
              <IonLabel>{t("label.music")}</IonLabel>
            </IonListHeader>
            {songs.map((song) => (
              <Credit key={song.id} track={song}></Credit>
            ))}
          </IonList>
          <IonList>
            <IonListHeader lines="inset">
              <IonLabel>{t("label.sounds")}</IonLabel>
            </IonListHeader>
            {sounds.map((sound) => (
              <Credit key={sound.id} track={sound}></Credit>
            ))}
          </IonList>
          <IonList>
            <IonItem lines="none">
              <IonNote>
                <Trans i18nKey="creditsModal.note">
                  Original tracks in{" "}
                  <abbr title="Waveform Audio File Format">WAV</abbr> format
                  were converted to{" "}
                  <abbr title="MPEG Audio Layer III">MP3</abbr> format in
                  accordance with license terms.
                </Trans>
              </IonNote>
            </IonItem>
            <IonItem lines="none"></IonItem>
          </IonList>
        </IonContent>
      </IonModal>
    </>
  );
};

export default CreditsModal;
