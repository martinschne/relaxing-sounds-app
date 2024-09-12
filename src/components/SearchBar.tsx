import { useEffect, useState } from "react";
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
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const getSearch = setTimeout(() => {
      const query = searchText.toLowerCase();

      const filteredTracks = tracks.filter(
        (track) =>
          track.name.toLowerCase().includes(query) ||
          track.artist.toLowerCase().includes(query) ||
          track.tags.some((tag) => tag.toLowerCase().includes(query))
      );

      setSearchText(query);
      setFilteredTracks(() => JSON.parse(JSON.stringify(filteredTracks)));
    }, 250);

    return () => clearTimeout(getSearch);
  }, [searchText]);

  return (
    <IonSearchbar
      value={searchText}
      placeholder={searchPlaceHolder}
      onIonInput={(event) => setSearchText(event.target.value ?? "")}
    ></IonSearchbar>
  );
};
