import { IonRange, IonIcon } from "@ionic/react";
import {
  volumeMuteOutline,
  volumeLowOutline,
  volumeMediumOutline,
  volumeHighOutline,
} from "ionicons/icons";
import { useGlobalContext } from "../providers/GlobalContextProvider";

interface VolumeSliderProps {
  label: string;
  volume: number;
  onVolumeChange: (event: CustomEvent) => void;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({
  label,
  volume,
  onVolumeChange,
}) => {
  const getVolumeIcon = () => {
    if (volume === null || volume === 0) {
      return volumeMuteOutline;
    } else if (volume < 0.35) {
      return volumeLowOutline;
    } else if (volume < 0.7) {
      return volumeMediumOutline;
    } else {
      return volumeHighOutline;
    }
  };

  const { settings } = useGlobalContext();

  console.log("volume slider volume opens" + volume);

  return (
    <IonRange
      labelPlacement="fixed"
      label={label}
      value={volume}
      min={0}
      max={1}
      step={0.01}
      onIonChange={onVolumeChange}
    >
      <IonIcon slot="end" icon={getVolumeIcon()}></IonIcon>
    </IonRange>
  );
};

export default VolumeSlider;
