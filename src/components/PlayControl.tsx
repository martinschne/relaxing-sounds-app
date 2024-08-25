import { IonIcon, IonImg, IonItem, IonLabel, IonThumbnail } from "@ionic/react";
import { pauseOutline, playOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { Media, MediaObject } from "@awesome-cordova-plugins/media";
import { Capacitor } from "@capacitor/core";
import { getNativePublicPath } from "../utils/pathUtils";
import { useAudioContext } from "../contexts/AudioContextProvider";
import { loadPreference, PreferenceKeys } from "../utils/preferencesUtils";
import { formatVolume, Percentage } from "../utils/formatter";

type MediaType = "music" | "effect";

interface PlayControlProps {
  id?: string;
  name?: string;
  image?: string;
  artist?: string;
  path?: string;
  source?: string;
  type: MediaType;
}

const PlayControl: React.FC<PlayControlProps> = ({
  id,
  image,
  name,
  artist,
  path,
  source,
  type,
}) => {
  const songMediaObjectRef = useRef<MediaObject | null>(null);
  const songAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const statusUpdateSubscription = useRef<any>(null);

  const [isPlaying, setIsPlaying] = useState<Boolean>(false);
  const [isInitialized, setIsInitialized] = useState<Boolean>(false);
  const [isPausedByUser, setIsPausedByUser] = useState<Boolean>(false);

  const { setMusicAudio, setEffectAudio } = useAudioContext();
  const [loadedVolume, setLoadedVolume] = useState(1.0);

  let setAudio: any = null;
  let volumePreferenceKey: PreferenceKeys;

  if (type === "music") {
    setAudio = setMusicAudio;
    volumePreferenceKey = PreferenceKeys.SONG_VOLUME_PERCENTAGE;
  } else {
    setAudio = setEffectAudio;
    volumePreferenceKey = PreferenceKeys.EFFECT_VOLUME_PERCENTAGE;
  }

  const loadPreferences = async () => {
    const percentage: Percentage =
      (await loadPreference(volumePreferenceKey)) ?? 100;

    const volume = formatVolume(percentage);
    setLoadedVolume(volume);
  };

  const initializeAudio = async () => {
    // load volume preferences
    await loadPreferences();

    if (!source || !path) {
      return;
    }

    const songPath: string = `${path}${source}`;

    if (Capacitor.isNativePlatform()) {
      // Cleanup previous media object if it exists
      if (songMediaObjectRef.current) {
        songMediaObjectRef.current.stop();
        songMediaObjectRef.current.release();
        songMediaObjectRef.current = null; // exp
        setAudio(null);
      }
      try {
        const nativePath = getNativePublicPath(songPath);
        songMediaObjectRef.current = Media.create(nativePath);
        songMediaObjectRef.current?.setVolume(loadedVolume);

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
            setAudio(songMediaObjectRef.current);
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
        setAudio(null);
      }

      try {
        songAudioElementRef.current = new Audio(songPath);
        songAudioElementRef.current.volume = loadedVolume;
        songAudioElementRef.current.loop = true;

        setTimeout(async () => {
          if (id !== "0") {
            setIsPlaying(true);
            setAudio(songAudioElementRef.current);
            await songAudioElementRef.current?.play();
          }
        }, 500);

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
          setAudio(null);
        }
      } else {
        // Cleanup for web audio
        if (songAudioElementRef.current) {
          songAudioElementRef.current.pause();
          songAudioElementRef.current.src = "";
          songAudioElementRef.current.load();
          songAudioElementRef.current = null;
          setAudio(null);
        }
      }
    };
  }, [id, source, loadedVolume]);

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
