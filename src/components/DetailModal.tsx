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
import { Track } from "../types";
import { useRef } from "react";
import FallbackImage from "./FallbackImage";
import { useTranslation } from "react-i18next";

interface DetailModalProps {
  track: Track;
  isOpen: boolean;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({
  track,
  isOpen,
  onClose,
}) => {
  const modal = useRef<HTMLIonModalElement>(null);

  const { t } = useTranslation();

  const handleModalClick = (event: React.MouseEvent<HTMLIonModalElement>) => {
    event.stopPropagation();
  };

  return (
    <IonModal
      ref={modal}
      isOpen={isOpen}
      keepContentsMounted={true}
      aria-labelledby={t("detailModal.header")}
      onClick={handleModalClick}
      onDidDismiss={onClose}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t("detailModal.header")}</IonTitle>
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
        <IonCard>
          <FallbackImage
            src={track.image}
            alt={`Album cover for '${track.name}' by ${track.artist}`}
          />
          <IonCardHeader>
            <IonCardTitle>{track.name}</IonCardTitle>
            <IonCardSubtitle>{track.artist}</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText>{track.description}</IonText>
            <div className="ion-margin-top">
              {track.tags.map((tag, index) => (
                <IonChip
                  key={index}
                  style={{ marginLeft: "0", marginRight: "8px" }}
                >
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
