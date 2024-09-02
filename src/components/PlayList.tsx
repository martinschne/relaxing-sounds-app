import { Track, PlaybackSettingKeys } from "../types";
import { IonList } from "@ionic/react";
import SongCard from "./SongCard";
import { useGlobalContext } from "../providers/GlobalContextProvider";

export interface PlayListProps {
  filteredTracks: Track[];
  selectedTrackKey: PlaybackSettingKeys;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlayList: React.FC<PlayListProps> = ({
  filteredTracks,
  selectedTrackKey,
  setIsPlaying,
}) => {
  const { settings, setSettings } = useGlobalContext();

  const saveSelectedTrack = (selectedTrack: Track) => {
    setSettings((prevSettings) => {
      return {
        ...prevSettings,
        [selectedTrackKey]: selectedTrack,
      };
    });
  };

  const handleSelectSong = async (id: string) => {
    const filteredSong = filteredTracks.find((song: Track) => song.id === id);
    const selected = JSON.parse(JSON.stringify(filteredSong));
    saveSelectedTrack(selected);
    setIsPlaying(true);
    console.log("The song was selected to play: " + selected.name);
  };

  return (
    <IonList>
      {filteredTracks.map((song: Track) => (
        <SongCard key={song.id} song={song} onSelect={handleSelectSong} />
      ))}
    </IonList>
  );
};

export default PlayList;
