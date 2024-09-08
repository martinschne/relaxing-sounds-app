import { useState } from "react";
import { Track } from "../types";
import { IonSearchbar } from "@ionic/react";

export interface SearchBarProps {
  tracks: Track[];
  setFilteredTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  searchPlaceHolder: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  tracks,
  setFilteredTracks,
  searchPlaceHolder,
}) => {
  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = (event: CustomEvent) => {
    const query = event.detail.value!.toLowerCase();

    const filteredTracks = tracks.filter(
      (track) =>
        track.name.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query) ||
        track.tags.some((tag) => tag.toLowerCase().includes(query))
    );

    setSearchText(query);
    setFilteredTracks(() => JSON.parse(JSON.stringify(filteredTracks)));
  };

  return (
    <IonSearchbar
      value={searchText}
      placeholder={searchPlaceHolder}
      onIonInput={handleSearch}
    ></IonSearchbar>
  );
};
