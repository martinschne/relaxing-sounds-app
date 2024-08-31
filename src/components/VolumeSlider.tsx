import { IonItem, IonRange, IonIcon } from "@ionic/react";
import {
  volumeMuteOutline,
  volumeLowOutline,
  volumeMediumOutline,
  volumeHighOutline,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../contexts/GlobalContextProvider";
import { loadPreference, savePreference } from "../utils/preferenceUtils";
import { Percentage, TrackTypes, PreferenceKeys } from "../types";
import { getDataByType } from "../utils";

interface VolumeSliderProps {
  type: TrackTypes;
  label: string;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({ type, label }) => {
  const getVolumeIcon = (volume: number | null) => {
    if (volume === null || volume === 0) {
      return volumeMuteOutline;
    } else if (volume < 35) {
      return volumeLowOutline;
    } else if (volume < 70) {
      return volumeMediumOutline;
    } else {
      return volumeHighOutline;
    }
  };

  const [volumePercentage, setVolumePercentage] = useState<number>(0);
  const [volumeIcon, setVolumeIcon] = useState<string>(
    getVolumeIcon(volumePercentage)
  );
  const {
    musicVolumePercentage,
    effectVolumePercentage,
    setMusicVolumePercentage,
    setEffectVolumePercentage,
    adjustVolume,
  } = useGlobalContext();

  const saveVolumePercentage = async (newVolume: Percentage) => {
    // save the new volume level to preferences
    if (type === TrackTypes.MUSIC) {
      await savePreference(PreferenceKeys.SONG_VOLUME_PERCENTAGE, newVolume);
      // save volume to context
      setMusicVolumePercentage(newVolume);
    } else if (type === TrackTypes.SOUND) {
      await savePreference(PreferenceKeys.EFFECT_VOLUME_PERCENTAGE, newVolume);
      setEffectVolumePercentage(newVolume);
    }
  };

  const handleVolumeChange = (event: CustomEvent) => {
    const newVolume = event.detail.value as Percentage;
    setVolumePercentage(newVolume);
    setVolumeIcon(getVolumeIcon(newVolume));
    adjustVolume(type, newVolume);
    saveVolumePercentage(newVolume);
  };

  const dependencies = getDataByType(
    type,
    [musicVolumePercentage],
    [effectVolumePercentage]
  );

  const loadVolumePercentage = async () => {
    let percentage: Percentage | null = null;
    if (type === TrackTypes.MUSIC) {
      percentage = await loadPreference(PreferenceKeys.SONG_VOLUME_PERCENTAGE);
    }
    if (type === TrackTypes.SOUND) {
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

  // loading saved volume from preferences
  useEffect(() => {
    loadVolumePercentage();
  }, [...dependencies]);

  return (
    <IonRange
      id={type}
      labelPlacement="fixed"
      label={label}
      value={volumePercentage}
      min={0}
      max={100}
      onIonChange={handleVolumeChange}
    >
      <IonIcon slot="end" icon={volumeIcon}></IonIcon>
    </IonRange>
  );
};

export default VolumeSlider;
