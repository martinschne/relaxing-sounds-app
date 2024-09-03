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
import { useState } from "react";
import { Track, SettingsKeys } from "../types";
import FallbackImage from "./FallbackImage";
import { useGlobalContext } from "../providers/GlobalContextProvider";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

interface PlayControlProps {
  track: Track | null;
  path: string;
  play: boolean;
  volumeTypeKey: SettingsKeys;
}

const PlayControl: React.FC<PlayControlProps> = ({
  track,
  path,
  play,
  volumeTypeKey,
}) => {
  const { isPlaying, playAudio, pauseAudio, setIsPausedByUser } =
    useAudioPlayer(track, path, play, volumeTypeKey);

  const [showToast, setShowToast] = useState(false);
  const { settings, saveSettings } = useGlobalContext();

  const handlePlayClick = async () => {
    playAudio();
    setShowToast(true);
  };

  const handlePauseClick = () => {
    setIsPausedByUser(true);
    pauseAudio();
  };

  const handleUnmute = async () => {
    const UNMUTED_VOLUME = 1.0;
    saveSettings(volumeTypeKey, UNMUTED_VOLUME);
  };

  useIonViewWillEnter(() => {
    setShowToast(true);
  });

  useIonViewWillLeave(() => {
    setShowToast(false);
  });

  return (
    <>
      <IonToast
        isOpen={showToast && isPlaying && settings[volumeTypeKey] === 0}
        message="The volume is set to zero"
        buttons={[
          {
            text: "Unmute",
            handler: handleUnmute,
          },
        ]}
        icon={volumeMuteOutline}
        position="top"
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
