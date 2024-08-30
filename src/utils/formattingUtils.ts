import { Percentage, MediaType } from "../types";

export const formatVolume = (volume: Percentage) => {
  return volume / 100;
};

export const getDataByType = <T>(
  type: MediaType,
  firstTypeResult: T,
  secondTypeResult: T
): T => {
  if (type === "music") {
    return firstTypeResult;
  }
  return secondTypeResult;
};
