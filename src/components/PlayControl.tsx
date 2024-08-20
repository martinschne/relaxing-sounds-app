import { IonIcon, IonImg, IonItem, IonLabel, IonThumbnail } from "@ionic/react";
import { pauseOutline, playOutline } from "ionicons/icons";
import { useEffect, useState } from "react";

interface PlayControlProps {
  id: string;
  name?: string;
  image?: string;
  artist?: string;
  source?: string;
}

const PlayControl: React.FC<PlayControlProps> = ({
  id,
  image,
  name,
  artist,
  source,
}) => {
  const [isPlaying, setIsPlaying] = useState<Boolean>(true);

  useEffect(() => {
    setIsPlaying(true);
  }, [id]);

  function handlePlayClick(
    event: React.MouseEvent<HTMLIonIconElement, MouseEvent>
  ): void {
    setIsPlaying(true);
  }

  function handlePauseClick(
    event: React.MouseEvent<HTMLIonIconElement, MouseEvent>
  ): void {
    setIsPlaying(false);
  }

  return (
    <IonItem>
      <IonThumbnail slot="start">
        {image && (
          <IonImg
            src={`/assets/images/${image}`}
            alt={`Album cover for '${name}' by ${artist}`}
          ></IonImg>
        )}
      </IonThumbnail>
      <IonLabel>{name}</IonLabel>
      {isPlaying ? (
        <IonIcon
          icon={pauseOutline}
          aria-label="Pause song"
          onClick={handlePauseClick}
        ></IonIcon>
      ) : (
        <IonIcon
          icon={playOutline}
          aria-label="Play song"
          onClick={handlePlayClick}
        ></IonIcon>
      )}
    </IonItem>
  );
};

export default PlayControl;
