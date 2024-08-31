import { Percentage, TrackTypes } from "../types";

export const formatVolume = (volume: Percentage) => {
  return volume / 100;
};

export const getDataByType = <T>(
  type: TrackTypes,
  firstTypeResult: T,
  secondTypeResult: T
): T => {
  if (type === TrackTypes.MUSIC) {
    return firstTypeResult;
  }
  return secondTypeResult;
};
