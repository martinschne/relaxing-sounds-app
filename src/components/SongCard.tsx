import { IonItem, IonThumbnail, IonLabel, IonImg, IonIcon } from "@ionic/react";
import ActionsPopover from "./ActionsPopover";
import { Song } from "../types";
import { useState } from "react";
import { ellipsisHorizontalOutline } from "ionicons/icons";

export interface SongCardProps {
  song: Song;
  onSelect: (id: string) => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onSelect }) => {
  const [imgSrc, setImgSrc] = useState(`/assets/images/${song.image}`);

  const handleSongClick = () => {
    onSelect(song.id);
  };

  const handleImageLoadingError = () => {
    setImgSrc("/assets/images/thumbnail.svg");
  };

  return (
    <IonItem onClick={handleSongClick}>
      <IonThumbnail slot="start">
        <IonImg
          src={imgSrc}
          alt={`Album cover for '${song.name}' by ${song.artist}`}
          onError={handleImageLoadingError}
        ></IonImg>
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
