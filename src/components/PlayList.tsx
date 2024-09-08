import { Track, SettingsKeys } from "../types";
import { IonList } from "@ionic/react";
import TrackCard from "./TrackCard";
import { useGlobalContext } from "../providers/GlobalContextProvider";

export interface PlayListProps {
  filteredTracks: Track[];
  selectedTrackKey: SettingsKeys;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlayList: React.FC<PlayListProps> = ({
  filteredTracks,
  selectedTrackKey,
  setIsPlaying,
}) => {
  const { settings, saveSettings } = useGlobalContext();

  const saveSelectedTrack = (selectedTrack: Track) => {
    saveSettings(selectedTrackKey, selectedTrack);
  };

  const handleSelectTrack = async (id: string) => {
    const filteredTrack = filteredTracks.find(
      (track: Track) => track.id === id
    );
    const selected = JSON.parse(JSON.stringify(filteredTrack));
    saveSelectedTrack(selected);
    setIsPlaying(true);
    console.log("The track was selected to play: " + selected.name);
  };

  return (
    <IonList>
      {filteredTracks.map((track: Track) => (
        <TrackCard key={track.id} track={track} onSelect={handleSelectTrack} />
      ))}
    </IonList>
  );
};

export default PlayList;
