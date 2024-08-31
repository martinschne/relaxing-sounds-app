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
  IonText,
  IonItemDivider,
  IonItemGroup,
  IonNote,
  IonItem,
  IonFooter,
} from "@ionic/react";
import { useRef } from "react";

import { songs } from "../data/songs";
import { sounds } from "../data/sounds";
import Credit from "./Credit";

interface CreditsModalProps {}

const CreditsModal: React.FC<CreditsModalProps> = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  return (
    <>
      <IonModal
        ref={modal}
        trigger="credits-modal-trigger"
        keepContentsMounted={true}
        aria-labelledby="Credits"
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Credits</IonTitle>
            <IonButtons slot="end">
              <IonButton
                size="default"
                onClick={(event) => {
                  // event.stopPropagation();
                  modal.current?.dismiss();
                }}
              >
                Close
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonList>
            <IonListHeader lines="inset">
              <IonLabel>Music</IonLabel>
            </IonListHeader>
            {songs.map((song) => (
              <Credit key={song.id} track={song}></Credit>
            ))}
          </IonList>
          <IonList>
            <IonListHeader lines="inset">
              <IonLabel>Sounds</IonLabel>
            </IonListHeader>
            {sounds.map((sound) => (
              <Credit key={sound.id} track={sound}></Credit>
            ))}
          </IonList>
          <IonList>
            <IonItem lines="none">
              <IonNote>
                Original tracks in{" "}
                <abbr title="Waveform Audio File Format">WAV</abbr> format were
                converted to <abbr title="MPEG Audio Layer III">MP3</abbr>{" "}
                format in accordance with license terms.
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
