import {
  IonIcon,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonToast,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { pauseOutline, playOutline, volumeMuteOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { Media, MediaObject } from "@awesome-cordova-plugins/media";
import { Capacitor } from "@capacitor/core";
import { getNativePublicPath } from "../utils/getNativePublicPath";
import { useGlobalContext } from "../providers/GlobalContextProvider";
import { TrackTypes, Track, AudioObject } from "../types";
import FallbackImage from "./FallbackImage";

interface PlayControlProps {
  track: Track;
  type: TrackTypes;
  path: string;
  play: boolean;
}

const PlayControl: React.FC<PlayControlProps> = ({
  track,
  type,
  path,
  play,
}) => {
  const audioObjectRef = useRef<AudioObject>(null);
  const statusUpdateSubscriptionRef = useRef<any>(null);

  const [isPlaying, setIsPlaying] = useState<Boolean>(false);
  const [isInitialized, setIsInitialized] = useState<Boolean>(false);
  const [isPausedByUser, setIsPausedByUser] = useState<Boolean>(false);

  const { settings, setSettings } = useGlobalContext();

  const getVolumeByType = (): number => {
    return type === TrackTypes.MUSIC
      ? settings.musicVolume
      : settings.soundVolume;
  };
  const [loadedVolume, setLoadedVolume] = useState<number>(getVolumeByType());
  const [showToast, setShowToast] = useState(false);

  const playAudio = () => {
    if (audioObjectRef.current) {
      setIsPlaying(true);
      audioObjectRef.current.play();
    }
  };

  const pauseAudio = () => {
    if (audioObjectRef.current) {
      setIsPlaying(false);
      audioObjectRef.current.pause();
    }
  };

  const audioCleanup = () => {
    // do not clean up empty object
    if (audioObjectRef.current === null) {
      return;
    }

    if (audioObjectRef.current instanceof MediaObject) {
      const mediaObject = audioObjectRef.current as MediaObject;
      mediaObject.stop();
      mediaObject.release();
      console.log("removing media object");
    } else if (audioObjectRef.current instanceof HTMLAudioElement) {
      const audioElement = audioObjectRef.current as HTMLAudioElement;
      audioElement.pause();
      audioElement.src = "";
      audioElement.load();
      console.log("removing audio object");
    }

    audioObjectRef.current = null;
  };

  const adjustVolume = () => {
    if (audioObjectRef.current === null) {
      return;
    }
    const newVolume = getVolumeByType();

    if (Capacitor.isNativePlatform()) {
      const mediaObject = audioObjectRef.current as MediaObject;
      mediaObject.setVolume(newVolume);
    } else {
      const htmlAudioElement = audioObjectRef.current as HTMLMediaElement;
      htmlAudioElement.volume = newVolume;
    }
  };

  const initializeAudio = async () => {
    if (!track) return;

    const trackPath: string = `${path}${track.source}`;

    audioCleanup();
    // android/ios for native platform use cordove media plugin
    if (Capacitor.isNativePlatform()) {
      try {
        const nativePath = getNativePublicPath(trackPath);
        audioObjectRef.current = Media.create(nativePath);
        let mediaObject = audioObjectRef.current as MediaObject;

        // loop media after playback ended
        statusUpdateSubscriptionRef.current =
          mediaObject.onStatusUpdate.subscribe((status) => {
            if (status === Media.MEDIA_STOPPED && !isPausedByUser) {
              console.log(
                `$$ PlayControl init ${type} finished mediaObj: ${JSON.stringify(
                  mediaObject
                )}`
              );
              playAudio();
            }
          });

        setIsInitialized(true);
      } catch (error) {
        setIsInitialized(false);
        console.error("Error initializing media: ", error);
      }
    } else {
      // web browser - use Audio API
      try {
        audioObjectRef.current = new Audio(trackPath);
        let audioElement = audioObjectRef.current as HTMLAudioElement;
        audioElement.loop = true;
        setIsInitialized(true);
      } catch (error) {
        setIsInitialized(false);
        console.error("Error playing audio:", error);
      }
    }
    // autoplay selected track from playlist
    if (isInitialized) {
      setTimeout(() => {
        if (play) {
          playAudio();
          adjustVolume();
        }
      }, 500);
    }
  };

  useEffect(() => {
    initializeAudio();
    return () => {
      audioCleanup();
      if (Capacitor.isNativePlatform()) {
        if (statusUpdateSubscriptionRef.current) {
          statusUpdateSubscriptionRef.current.unsubscribe();
        }
      }
    };
  }, [track]);

  useEffect(() => {
    setLoadedVolume(getVolumeByType());
    adjustVolume();
  }, [settings.musicVolume, settings.soundVolume]);

  const handlePlayClick = async () => {
    if (!isInitialized) {
      await initializeAudio();
    }
    playAudio();
    setShowToast(true);
  };

  const handlePauseClick = () => {
    if (Capacitor.isNativePlatform()) {
      setIsPausedByUser(true);
    }
    pauseAudio();
  };

  useIonViewWillEnter(() => {
    setShowToast(true);
  });

  useIonViewWillLeave(() => {
    setShowToast(false);
  });

  const handleUnmute = async () => {
    const UNMUTED_VOLUME = 1.0;

    if (type === TrackTypes.MUSIC) {
      setSettings((prevSettings) => {
        return {
          ...prevSettings,
          musicVolume: UNMUTED_VOLUME,
        };
      });
    } else if (type === TrackTypes.SOUND) {
      setSettings((prevSettings) => {
        return {
          ...prevSettings,
          soundVolume: UNMUTED_VOLUME,
        };
      });
    }
  };

  return (
    <>
      <IonToast
        isOpen={showToast && isPlaying && loadedVolume === 0}
        message="The volume is set to zero"
        buttons={[
          {
            text: "Unmute",
            handler: handleUnmute,
          },
        ]}
        icon={volumeMuteOutline}
        position="bottom"
        positionAnchor={`${type}Footer`}
        swipeGesture="vertical"
        duration={5000}
        animated={showToast}
        onDidDismiss={() => setShowToast(false)}
      ></IonToast>
      {track && (
        <IonItem>
          <IonThumbnail slot="start">
            <FallbackImage
              src={track.image}
              alt={`Album cover for '${track.name}' by ${track.artist}`}
            />
          </IonThumbnail>
          <IonLabel>{track.name}</IonLabel>
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
      )}
    </>
  );
};

export default PlayControl;
