import { IonPopover, IonContent, IonList } from "@ionic/react";
import { informationCircleOutline, shareOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { Track } from "../types";
import PopoverItem from "./PopoverItem";
import { Share } from "@capacitor/share";
import DetailModal from "./DetailModal/DetailModal";

interface ActionsPopoverProps {
  song: Track;
  isOpen?: boolean;
}

const ActionsPopover: React.FC<ActionsPopoverProps> = ({ song, isOpen }) => {
  const actionsPopover = useRef<HTMLIonPopoverElement>(null);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [sharingPossible, setSharingPossible] = useState<boolean | null>(null);

  const closePopover = async () => {
    await actionsPopover.current?.dismiss();
  };

  const handleDetailModalOpen = async () => {
    await closePopover();
    setDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setDetailModalOpen(false);
  };

  const handleShare = async () => {
    await closePopover();
    try {
      await Share.share({
        title: `${song.artist} - ${song.name}`,
        text: "Here is an interesting track from Relaxing Sounds app!",
        url: song.url ?? undefined,
        dialogTitle: "Share with friends",
      });
    } catch (error) {
      console.error("Error while sharing the media: " + error);
    }
  };

  const isSharingPossible = async (): Promise<boolean> => {
    try {
      const result = await Share.canShare();
      return result.value;
    } catch (error) {
      console.error("Error checking share capability:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkSharingCapability = async () => {
      const result = await isSharingPossible();
      setSharingPossible(result);
    };

    checkSharingCapability();
  });

  return (
    <>
      <IonPopover
        ref={actionsPopover}
        trigger={`actions-trigger-${song.id}`}
        triggerAction="click"
        onClick={(event) => event.stopPropagation()}
      >
        <IonContent>
          <IonList>
            <PopoverItem
              id="open-detail-modal"
              text="Detail"
              icon={informationCircleOutline}
              onSelect={handleDetailModalOpen}
            />
            {sharingPossible && (
              <PopoverItem
                text="Share"
                icon={shareOutline}
                onSelect={handleShare}
              />
            )}
          </IonList>
        </IonContent>
      </IonPopover>

      <DetailModal
        song={song}
        isOpen={detailModalOpen}
        onClose={handleDetailModalClose}
      />
    </>
  );
};

export default ActionsPopover;
