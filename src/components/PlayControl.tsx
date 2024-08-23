import { IonIcon, IonImg, IonItem, IonLabel, IonThumbnail } from "@ionic/react";
import { pauseOutline, playOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { Media, MediaObject } from "@awesome-cordova-plugins/media";
import { BackgroundMode } from "@awesome-cordova-plugins/background-mode";
import { Capacitor } from "@capacitor/core";
import { getPath } from "../util/getPath";

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
  const songMediaObjectRef = useRef<MediaObject | null>(null);
  const songAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const statusUpdateSubscription = useRef<any>(null);

  const [isPlaying, setIsPlaying] = useState<Boolean>(false);
  const [isInitialized, setIsInitialized] = useState<Boolean>(false);
  const [isCleanupDone, setIsCleanupDone] = useState<Boolean>(false);
  const [isPausedByUser, setIsPausedByUser] = useState<Boolean>(false);

  const initializeAudio = async () => {
    if (!isCleanupDone) return;

    // web path
    const songURI: string = `/assets/music/${source}`;

    if (Capacitor.isNativePlatform()) {
      // prepare background mode for native platforms
      BackgroundMode.enable();

      // Cleanup previous media object if it exists
      if (songMediaObjectRef.current) {
        songMediaObjectRef.current.stop();
        songMediaObjectRef.current.release();
        songMediaObjectRef.current = null;
      }
      try {
        const nativeFilePath = getPath(songURI);
        songMediaObjectRef.current = Media.create(nativeFilePath);

        // restart audio when it ends automatically
        statusUpdateSubscription.current =
          songMediaObjectRef.current.onStatusUpdate.subscribe((status) => {
            if (status === Media.MEDIA_STOPPED && !isPausedByUser) {
              songMediaObjectRef.current?.play();
            }
          });

        setTimeout(() => {
          songMediaObjectRef.current?.play();
          setIsPlaying(true);
          setIsInitialized(true);
        }, 500);
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
        songAudioElementRef.current = new Audio(songURI);
        songAudioElementRef.current.loop = true;
        await songAudioElementRef.current.play();
        setIsPlaying(true);
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
      setIsCleanupDone(true);

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
    if (!isInitialized) {
      await initializeAudio();
    }
    if (Capacitor.isNativePlatform()) {
      songMediaObjectRef.current?.play();
    } else {
      await songAudioElementRef.current?.play();
    }
    setIsPlaying(true);
  };

  const handlePauseClick = () => {
    if (Capacitor.isNativePlatform()) {
      setIsPausedByUser(true);
      songMediaObjectRef.current?.pause();
    } else {
      songAudioElementRef.current?.pause();
    }
    setIsPlaying(false);
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
