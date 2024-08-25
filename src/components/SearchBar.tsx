import { useState } from "react";
import { Song } from "../data/songs";
import { IonSearchbar } from "@ionic/react";

export interface SearchBarProps {
  songs: Song[];
  setFilteredSongs: React.Dispatch<React.SetStateAction<Song[]>>;
  searchPlaceHolder: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  songs,
  setFilteredSongs,
  searchPlaceHolder,
}) => {
  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = (event: CustomEvent) => {
    const query = event.detail.value!.toLowerCase();

    const filteredSongs = songs.filter(
      (song) =>
        song.name.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        song.tags.some((tag) => tag.toLowerCase().includes(query)),
    );

    setSearchText(query);
    setFilteredSongs(() => JSON.parse(JSON.stringify(filteredSongs)));
  };

  return (
    <IonSearchbar
      value={searchText}
      placeholder={searchPlaceHolder}
      onIonInput={handleSearch}
    ></IonSearchbar>
  );
};
