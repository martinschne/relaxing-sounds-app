import { IonIcon, IonImg, IonItem, IonLabel, IonThumbnail } from "@ionic/react";
import { pauseOutline, playOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { Media, MediaObject } from "@awesome-cordova-plugins/media";
import { Capacitor } from "@capacitor/core";
import { getNativePublicPath } from "../utils/pathUtils";
import { useAudioContext } from "../contexts/AudioContextProvider";
import { loadPreference, PreferenceKeys } from "../utils/preferencesUtils";
import { formatVolume, getDataByType, Percentage } from "../utils/formatter";

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

  const {
    setMusicAudio,
    setEffectAudio,
    musicVolumePercentage,
    effectVolumePercentage,
  } = useAudioContext();
  const [loadedVolume, setLoadedVolume] = useState(1.0);

  let setAudio = getDataByType(type, setMusicAudio, setEffectAudio);

  const loadPreferences = async () => {
    let volumePreferenceKey = getDataByType(
      type,
      PreferenceKeys.SONG_VOLUME_PERCENTAGE,
      PreferenceKeys.EFFECT_VOLUME_PERCENTAGE
    );
    console.log("$$ PreferenceKey " + volumePreferenceKey);
    const percentage: Percentage =
      (await loadPreference(volumePreferenceKey)) ?? 100;
    console.log(
      "$$ PlayControl: loaded percentage for " + type + " is" + percentage
    );
    const volume = formatVolume(percentage);
    console.log("$$ PlayControl: loaded volume for " + type + " is " + volume);
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
        console.log(
          "$$ songMediaObjectRef is" +
            JSON.stringify(songMediaObjectRef.current)
        );
        songMediaObjectRef.current.stop();
        songMediaObjectRef.current.release();
        songMediaObjectRef.current = null;
      }
      try {
        const nativePath = getNativePublicPath(songPath);
        songMediaObjectRef.current = Media.create(nativePath);
        console.log(
          "$$ media created: " + JSON.stringify(songMediaObjectRef.current)
        );
        setAudio(songMediaObjectRef.current);

        statusUpdateSubscription.current =
          songMediaObjectRef.current.onStatusUpdate.subscribe((status) => {
            // restart audio when it ends automatically
            if (status === Media.MEDIA_STOPPED && !isPausedByUser) {
              console.log(
                `$$ PlayControl init ${type} finished mediaObj: ${JSON.stringify(
                  songMediaObjectRef.current
                )}`
              );
              songMediaObjectRef.current?.play();
            }
          });

        setTimeout(() => {
          if (id !== "0") {
            setIsPlaying(true);
            console.log(
              "$$ store media obj in audio ctx: " +
                JSON.stringify(songMediaObjectRef.current)
            );
            songMediaObjectRef.current?.play();
            songMediaObjectRef.current?.setVolume(loadedVolume);
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
        songAudioElementRef.current.loop = true;
        songAudioElementRef.current.volume = loadedVolume;
        setAudio(songAudioElementRef.current);

        setTimeout(async () => {
          if (id !== "0") {
            setIsPlaying(true);
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
  // experimental
  useEffect(() => {
    loadPreferences();
  }, [musicVolumePercentage, effectVolumePercentage]);

  const handlePlayClick = async () => {
    setIsPlaying(true);

    if (!isInitialized) {
      await initializeAudio();
    }
    if (Capacitor.isNativePlatform()) {
      songMediaObjectRef.current?.play();
      console.log(
        "$$ PlayControl clicked play button, volume: " + loadedVolume
      );
      songMediaObjectRef.current?.setVolume(loadedVolume);
    } else {
      if (songAudioElementRef.current !== null) {
        songAudioElementRef.current.volume = loadedVolume;
      }
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
