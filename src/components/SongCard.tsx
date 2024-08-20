import {
  IonItem,
  IonThumbnail,
  IonLabel,
  IonImg,
  IonIcon,
  IonPopover,
  IonContent,
  IonList,
} from "@ionic/react";
import { Song } from "../data/songs";
import { ellipsisHorizontalOutline } from "ionicons/icons";
import { useRef, useState } from "react";

export interface SongCardProps {
  song: Song;
  onSelect: (id: string) => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onSelect }) => {
  const actionsPopover = useRef<HTMLIonPopoverElement>(null);
  const [actionsPopoverOpen, setActionsPopoverOpen] = useState(false);

  const openActionsPopover = (e: any) => {
    actionsPopover.current!.event = e;
    setActionsPopoverOpen(true);
  };

  return (
    <IonItem onClick={() => onSelect(song.id)}>
      <IonThumbnail slot="start">
        {song.image && (
          <IonImg
            src={`/assets/images/${song.image}`}
            alt={`Album cover for '${song.name}' by ${song.artist}`}
          ></IonImg>
        )}
      </IonThumbnail>
      <IonLabel>
        <h2>{song.name}</h2>
        <p>{song.artist}</p>
      </IonLabel>
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
        <IonContent class="ion-padding">
          <IonList>
            <IonItem>
              <IonLabel>Detail</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Share</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPopover>
    </IonItem>
  );
};

export default SongCard;
