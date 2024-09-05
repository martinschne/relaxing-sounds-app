import { IonItem, IonThumbnail, IonLabel, IonIcon } from "@ionic/react";
import ActionsPopover from "./ActionsPopover";
import { Track } from "../types";
import { ellipsisHorizontalOutline } from "ionicons/icons";
import FallbackImage from "./FallbackImage";

export interface SongCardProps {
  song: Track;
  onSelect: (id: string) => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onSelect }) => {
  const handleSongClick = () => {
    onSelect(song.id);
  };

  return (
    <IonItem onClick={handleSongClick}>
      <IonThumbnail slot="start">
        <FallbackImage
          src={song.image}
          alt={`Album cover for '${song.name}' by ${song.artist}`}
        />
      </IonThumbnail>
      <IonLabel>
        <h2>{song.name}</h2>
        <p>{song.artist}</p>
      </IonLabel>
      <IonIcon
        id={`actions-trigger-${song.id}`}
        icon={ellipsisHorizontalOutline}
        onClick={(event) => event.stopPropagation()}
        aria-label="Song actions"
      ></IonIcon>
      <ActionsPopover song={song} />
    </IonItem>
  );
};

export default SongCard;
