import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonLabel,
  IonModal,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Track } from "../../types";
import { useRef } from "react";
import FallbackImage from "../FallbackImage";

import "./DetailModal.css";

interface DetailModalProps {
  song: Track;
  isOpen: boolean;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ song, isOpen, onClose }) => {
  const modal = useRef<HTMLIonModalElement>(null);

  return (
    <IonModal
      ref={modal}
      isOpen={isOpen}
      keepContentsMounted={true}
      onDidDismiss={onClose}
      aria-labelledby="Detail"
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>Detail</IonTitle>
          <IonButtons slot="end">
            <IonButton
              size="default"
              onClick={(event) => {
                event.stopPropagation();
                modal.current?.dismiss();
              }}
            >
              Close
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <FallbackImage
            className="modal-thumbnail"
            src={song.image}
            alt={`Album cover for '${song.name}' by ${song.artist}`}
          />
          <IonCardHeader>
            <IonCardTitle>{song.name}</IonCardTitle>
            <IonCardSubtitle>{song.artist}</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText>
              <p>{song.description}</p>
            </IonText>
            <div className="tags-container">
              {song.tags.map((tag, index) => (
                <IonChip key={index}>
                  <IonLabel>#{tag}</IonLabel>
                </IonChip>
              ))}
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonModal>
  );
};

export default DetailModal;
