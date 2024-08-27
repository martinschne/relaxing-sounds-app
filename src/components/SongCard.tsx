import { IonItem, IonThumbnail, IonLabel, IonImg } from "@ionic/react";
import ActionsPopover from "./ActionsPopover";
import { Song } from "../types";

export interface SongCardProps {
  song: Song;
  onSelect: (id: string) => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onSelect }) => {
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
      <ActionsPopover song={song} />
    </IonItem>
  );
};

export default SongCard;
