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
  const NO_PROGRESS = 0;
  const FULL_PROGRESS = 1;

  const audioObjectRef = useRef<AudioObject>(null);
  const statusUpdateSubscriptionRef = useRef<Subscription | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { settings } = useGlobalContext();

  const [isPlaying, setIsPlaying] = useState<Boolean>(false);
  const [isInitialized, setIsInitialized] = useState<Boolean>(false);
  const [isPausedByUser, setIsPausedByUser] = useState<Boolean>(false);
  const [playBackProgress, setPlayBackProgress] = useState<number>(NO_PROGRESS);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    getDuration()
  );

  // BEGIN Helper functions
  function getDuration(): number {
    return Number(settings.duration);
  }

  const getVolume = (): number => {
    return settings[volumeTypeKey] as number;
  };

  const isDurationSet = () => {
    return getDuration() !== Infinity;
  };
  // END

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

  function adjustVolume() {
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
  }

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
    // android/ios for native platform use cordova media plugin
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

  const startProgress = () => {
    if (!isDurationSet()) {
      return;
    }

    const DURATION_SECONDS = getDuration() * 60;
    const step = FULL_PROGRESS / DURATION_SECONDS;

    progressIntervalRef.current = setInterval(() => {
      setPlayBackProgress((prevProgress) =>
        Math.min(prevProgress + step, FULL_PROGRESS)
      );
      setRemainingSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);
  };

  const stopProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const resetProgress = () => {
    stopProgress();
    setPlayBackProgress(NO_PROGRESS);
    setRemainingSeconds(getDuration() * 60);
  };

  useEffect(() => {
    initializeAudio();
    return () => {
      audioCleanup();
      resetProgress();
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

  // when new track or duration is chosen, restart the progress
  useEffect(() => {
    resetProgress();

    if (isPlaying) {
      startProgress();
    }
  }, [track, settings.duration]);

  // when duration time finished, pause audio and restart the progress
  useEffect(() => {
    if (playBackProgress === FULL_PROGRESS) {
      pauseAudio();
      resetProgress();
    }
  }, [playBackProgress]);

  return {
    isPlaying,
    playBackProgress,
    remainingSeconds,
    playAudio,
    pauseAudio,
    setIsPausedByUser,
  };
};
