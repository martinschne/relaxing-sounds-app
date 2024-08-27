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

interface ActionsPopoverProps {
  song: Song;
}

const ActionsPopover: React.FC<ActionsPopoverProps> = ({ song }) => {
  const actionsPopover = useRef<HTMLIonPopoverElement>(null);

  const [actionsPopoverOpen, setActionsPopoverOpen] = useState(false);
  // const [isShareLoading, setIsShareLoading] = useState(false);
  const [sharingPossible, setSharingPossible] = useState<boolean | null>(null);

  const openActionsPopover = (
    event: React.MouseEvent<HTMLIonIconElement, MouseEvent>
  ) => {
    actionsPopover.current!.event = event;
    setActionsPopoverOpen(true);
  };

  const handleShowDetail = () => {};

  const handleShare = async () => {
    try {
      await Share.share({
        title: `${song.artist} - ${song.name}`,
        text: "Look at this nice sound piece I found!",
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
        onClick={(event) => event.stopPropagation()}
      >
        <IonContent>
          <IonList>
            <PopoverItem
              text="Detail"
              icon={informationCircleOutline}
              onSelect={handleShowDetail}
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
    </>
  );
};

export default ActionsPopover;
