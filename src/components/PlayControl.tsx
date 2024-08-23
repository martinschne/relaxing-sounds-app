import { IonIcon, IonImg, IonItem, IonLabel, IonThumbnail } from "@ionic/react";
import { pauseOutline, playOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { Media, MediaObject } from "@awesome-cordova-plugins/media";
import { Capacitor } from "@capacitor/core";
import { getNativePublicPath } from "../utils/pathUtils";

interface PlayControlProps {
  id?: string;
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
  const songMediaObjectRef = useRef<MediaObject | null>(null);
  const songAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const statusUpdateSubscription = useRef<any>(null);

  const [isPlaying, setIsPlaying] = useState<Boolean>(false);
  const [isInitialized, setIsInitialized] = useState<Boolean>(false);
  const [isPausedByUser, setIsPausedByUser] = useState<Boolean>(false);

  const initializeAudio = async () => {
    const songPath: string = `/assets/music/${source}`;

    if (Capacitor.isNativePlatform()) {
      // Cleanup previous media object if it exists
      if (songMediaObjectRef.current) {
        songMediaObjectRef.current.stop();
        songMediaObjectRef.current.release();
        songMediaObjectRef.current = null; // exp
      }
      try {
        const nativePath = getNativePublicPath(songPath);
        songMediaObjectRef.current = Media.create(nativePath);

        // restart audio when it ends automatically
        statusUpdateSubscription.current =
          songMediaObjectRef.current.onStatusUpdate.subscribe((status) => {
            if (status === Media.MEDIA_STOPPED && !isPausedByUser) {
              songMediaObjectRef.current?.play();
            }
          });

        setTimeout(() => {
          if (id !== "0") {
            setIsPlaying(true);
            songMediaObjectRef.current?.play();
          }
        }, 500);
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing media: ", error);
      }
    } else {
      // Cleanup previous audio element if it exists
      if (songAudioElementRef.current) {
        songAudioElementRef.current.pause();
        songAudioElementRef.current.src = "";
        songAudioElementRef.current.load();
        songAudioElementRef.current = null;
      }

      try {
        songAudioElementRef.current = new Audio(songPath);
        songAudioElementRef.current.loop = true;
        if (id !== "0") {
          setIsPlaying(true);
          await songAudioElementRef.current.play();
        }
        setIsInitialized(true);
      } catch (error) {
        console.error("Error playing audio:", error);
        setIsInitialized(false);
      }
    }
  };

  useEffect(() => {
    initializeAudio();

    return () => {
      if (Capacitor.isNativePlatform()) {
        if (statusUpdateSubscription.current) {
          statusUpdateSubscription.current.unsubscribe();
        }
        // Cleanup for native audio
        if (songMediaObjectRef.current) {
          songMediaObjectRef.current.stop();
          songMediaObjectRef.current.release();
          songMediaObjectRef.current = null;
        }
      } else {
        // Cleanup for web audio
        if (songAudioElementRef.current) {
          songAudioElementRef.current.pause();
          songAudioElementRef.current.src = "";
          songAudioElementRef.current.load();
          songAudioElementRef.current = null;
        }
      }
    };
  }, [id, source]);

  const handlePlayClick = async () => {
    setIsPlaying(true);

    if (!isInitialized) {
      await initializeAudio();
    }
    if (Capacitor.isNativePlatform()) {
      songMediaObjectRef.current?.play();
    } else {
      await songAudioElementRef.current?.play();
    }
  };

  const handlePauseClick = () => {
    setIsPlaying(false);

    if (Capacitor.isNativePlatform()) {
      setIsPausedByUser(true);
      songMediaObjectRef.current?.pause();
    } else {
      songAudioElementRef.current?.pause();
    }
  };

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
