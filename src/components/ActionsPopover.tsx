import { IonIcon, IonPopover, IonContent, IonList } from "@ionic/react";
import {
  ellipsisHorizontalOutline,
  informationCircleOutline,
  shareOutline,
} from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { Song } from "../types";
import PopoverItem from "./PopoverItem";
import { Share } from "@capacitor/share";
import DetailModal from "./DetailModal";

interface ActionsPopoverProps {
  song: Song;
}

const ActionsPopover: React.FC<ActionsPopoverProps> = ({ song }) => {
  const actionsPopover = useRef<HTMLIonPopoverElement>(null);

  const [actionsPopoverOpen, setActionsPopoverOpen] = useState(false);
  const [detailModelOpen, setDetailModelOpen] = useState(false);
  const [sharingPossible, setSharingPossible] = useState<boolean | null>(null);

  const openActionsPopover = (
    event: React.MouseEvent<HTMLIonIconElement, MouseEvent>
  ) => {
    actionsPopover.current!.event = event;
    setActionsPopoverOpen(true);
  };

  const handleDetailModalOpen = () => {
    setDetailModelOpen(true);
    setActionsPopoverOpen(false);
  };

  const handleDetailModalClose = () => {
    setDetailModelOpen(false);
  };

  const handleShare = async () => {
    setActionsPopoverOpen(false);
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
      return result.value; // result is a boolean
    } catch (error) {
      console.error("Error checking share capability:", error);
      return false; // Return false in case of an error
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
      <IonIcon
        id={`actions-trigger-${song.id}`}
        icon={ellipsisHorizontalOutline}
        onClick={(event) => {
          event.stopPropagation();
          openActionsPopover(event);
        }}
        aria-label="Song actions"
      ></IonIcon>

      <IonPopover
        ref={actionsPopover}
        isOpen={actionsPopoverOpen}
        onDidDismiss={() => setActionsPopoverOpen(false)}
        trigger={`actions-trigger-${song.id}`}
        triggerAction="click"
        // onClick={(event) => event.stopPropagation()}
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
        isOpen={detailModelOpen}
        onClose={handleDetailModalClose}
      />
    </>
  );
};

export default ActionsPopover;
