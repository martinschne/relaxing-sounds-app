import { IonItem, IonThumbnail, IonLabel, IonIcon } from "@ionic/react";
import ActionsPopover from "./ActionsPopover";
import { Track } from "../types";
import { ellipsisHorizontalOutline } from "ionicons/icons";
import FallbackImage from "./FallbackImage";

export interface TrackCardProps {
  track: Track;
  onSelect: (id: string) => void;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, onSelect }) => {
  const handleTrackClick = () => {
    onSelect(track.id);
  };

  return (
    <IonItem onClick={handleTrackClick}>
      <IonThumbnail slot="start">
        <FallbackImage
          src={track.image}
          alt={`Album cover for '${track.name}' by ${track.artist}`}
        />
      </IonThumbnail>
      <IonLabel>
        <h2>{track.name}</h2>
        <p>{track.artist}</p>
      </IonLabel>
      <IonIcon
        id={`actions-trigger-${track.id}`}
        icon={ellipsisHorizontalOutline}
        onClick={(event) => event.stopPropagation()}
        aria-label="Song actions"
      ></IonIcon>
      <ActionsPopover track={track} />
    </IonItem>
  );
};

export default TrackCard;
