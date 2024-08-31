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
import { useGlobalContext } from "../contexts/GlobalContextProvider";
import { loadPreference, savePreference } from "../utils/preferenceUtils";
import { formatVolume, getDataByType } from "../utils/formattingUtils";
import { Percentage, TrackTypes, Track, PreferenceKeys } from "../types";
import FallbackImage from "./FallbackImage";

interface PlayControlProps {
  song: Track | null;
  type: TrackTypes;
  path: string;
  play: boolean;
}

const PlayControl: React.FC<PlayControlProps> = ({
  song,
  path,
  type,
  play,
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
    setMusicVolumePercentage,
    setEffectVolumePercentage,
    adjustVolume,
  } = useGlobalContext();
  const [loadedVolume, setLoadedVolume] = useState(1.0);
  const [showToast, setShowToast] = useState(false);

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

    if (!song || !song.source || !path) {
      return;
    }

    const songPath: string = `${path}${song.source}`;

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
          if (play) {
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
          if (play) {
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
    console.log("Useffect: play is is set to " + play);
    console.log("Useffect: song.image is " + song?.image);
    initializeAudio();
    setShowToast(true); // reshow the toast for new song played
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
  }, [song?.source]);

  useEffect(() => {
    loadPreferences();
  }, [musicVolumePercentage, effectVolumePercentage]);

  const handlePlayClick = async () => {
    setIsPlaying(true);
    setShowToast(true);

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

  useIonViewWillEnter(() => {
    setShowToast(true);
  });

  useIonViewWillLeave(() => {
    setShowToast(false);
  });

  const handleUnmute = async () => {
    const UNMUTED_VOLUME = 100;

    if (type === TrackTypes.MUSIC) {
      await savePreference(
        PreferenceKeys.SONG_VOLUME_PERCENTAGE,
        UNMUTED_VOLUME
      );
      setMusicVolumePercentage(UNMUTED_VOLUME);
    } else if (type === TrackTypes.SOUND) {
      await savePreference(
        PreferenceKeys.EFFECT_VOLUME_PERCENTAGE,
        UNMUTED_VOLUME
      );
      setEffectVolumePercentage(UNMUTED_VOLUME);
    }
    adjustVolume(type, UNMUTED_VOLUME);
    setLoadedVolume(formatVolume(UNMUTED_VOLUME));
  };

  return (
    <>
      {showToast && (
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
          onDidDismiss={() => setShowToast(false)}
        ></IonToast>
      )}
      {song && (
        <IonItem>
          <IonThumbnail slot="start">
            <FallbackImage
              src={song.image}
              alt={`Album cover for '${song.name}' by ${song.artist}`}
            />
          </IonThumbnail>
          <IonLabel>{song.name}</IonLabel>
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
