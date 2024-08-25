import { IonItem, IonRange, IonIcon } from "@ionic/react";
import {
  volumeMuteOutline,
  volumeLowOutline,
  volumeMediumOutline,
  volumeHighOutline,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import { useAudioContext } from "../contexts/AudioContextProvider";
import {
  loadPreference,
  PreferenceKeys,
  savePreference,
} from "../utils/preferencesUtils";
import { Percentage } from "../utils/formatter";

interface VolumeSliderProps {
  id: "music" | "effect";
  label: string;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({ id, label }) => {
  const getVolumeIcon = (volume: number) => {
    if (volume === 0) {
      return volumeMuteOutline;
    } else if (volume < 35) {
      return volumeLowOutline;
    } else if (volume < 70) {
      return volumeMediumOutline;
    } else {
      return volumeHighOutline;
    }
  };

  const [volumePercentage, setVolumePercentage] = useState<number>(50);
  const [volumeIcon, setVolumeIcon] = useState<string>(
    getVolumeIcon(volumePercentage)
  );
  const { setMusicVolumePercentage, setEffectVolumePercentage, adjustVolume } =
    useAudioContext();

  const saveVolumePercentage = async (newVolume: Percentage) => {
    // save the new volume level to preferences
    if (id === "music") {
      await savePreference(PreferenceKeys.SONG_VOLUME_PERCENTAGE, newVolume);
      // save volume to context
      setMusicVolumePercentage(newVolume);
    } else if (id === "effect") {
      await savePreference(PreferenceKeys.EFFECT_VOLUME_PERCENTAGE, newVolume);
      setEffectVolumePercentage(newVolume);
    }
  };

  const handleVolumeChange = (event: CustomEvent) => {
    const newVolume = event.detail.value as Percentage;
    setVolumePercentage(newVolume);
    setVolumeIcon(getVolumeIcon(newVolume));
    adjustVolume(id, newVolume);
    saveVolumePercentage(newVolume);
  };

  // loading saved volume from preferences
  useEffect(() => {
    const loadVolumePercentage = async () => {
      let percentage: Percentage | null = null;
      if (id === "music") {
        percentage = await loadPreference(
          PreferenceKeys.SONG_VOLUME_PERCENTAGE
        );
      }
      if (id === "effect") {
        percentage = await loadPreference(
          PreferenceKeys.EFFECT_VOLUME_PERCENTAGE
        );
      }
      if (percentage !== null) {
        setVolumePercentage(percentage);
      } else {
        percentage = 100;
        setVolumePercentage(percentage);
      }
      setVolumeIcon(getVolumeIcon(percentage));
    };

    loadVolumePercentage();
  }, []);

  return (
    <IonItem>
      <IonRange
        id={id}
        labelPlacement="fixed"
        label={label}
        value={volumePercentage}
        min={0}
        max={100}
        onIonChange={handleVolumeChange}
      >
        <IonIcon slot="end" icon={volumeIcon}></IonIcon>
      </IonRange>
    </IonItem>
  );
};

export default VolumeSlider;
