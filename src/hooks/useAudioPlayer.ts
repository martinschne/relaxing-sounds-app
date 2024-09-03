import { MediaObject, Media } from "@awesome-cordova-plugins/media";
import { Subscription } from "rxjs";
import { Capacitor } from "@capacitor/core";
import { useRef, useState, useEffect } from "react";
import { useGlobalContext } from "../providers/GlobalContextProvider";
import { AudioObject, SettingsKeys, Track } from "../types";

import { getNativePublicPath } from "../utils/getNativePublicPath";

export const useAudioPlayer = (
  track: Track | null,
  path: string,
  play: boolean,
  volumeTypeKey: SettingsKeys
) => {
  const audioObjectRef = useRef<AudioObject>(null);
  const statusUpdateSubscriptionRef = useRef<Subscription | null>(null);

  const [isPlaying, setIsPlaying] = useState<Boolean>(false);
  const [isInitialized, setIsInitialized] = useState<Boolean>(false);
  const [isPausedByUser, setIsPausedByUser] = useState<Boolean>(false);

  const { settings } = useGlobalContext();

  const getVolume = (): number => {
    return settings[volumeTypeKey] as number;
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
    const newVolume = getVolume();

    if (Capacitor.isNativePlatform()) {
      const mediaObject = audioObjectRef.current as MediaObject;
      mediaObject.setVolume(newVolume);
    } else {
      const htmlAudioElement = audioObjectRef.current as HTMLMediaElement;
      htmlAudioElement.volume = newVolume;
    }
  };

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
      // cleanup loop subscription on native devices
      if (Capacitor.isNativePlatform()) {
        if (statusUpdateSubscriptionRef.current) {
          statusUpdateSubscriptionRef.current.unsubscribe();
        }
      }
    };
  }, [track]);

  useEffect(() => {
    adjustVolume();
  }, [settings.musicVolume, settings.soundVolume]);

  return {
    isPlaying,
    playAudio,
    pauseAudio,
    setIsPausedByUser,
  };
};
