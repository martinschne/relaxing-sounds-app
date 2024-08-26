import { PreferenceKeys } from "./preferencesUtils";

type Range<N extends number, T extends number[] = []> = T["length"] extends N
  ? T[number]
  : Range<N, [...T, T["length"]]>;

export type Percentage = Range<101>; // Range from 0 to 100

export const formatVolume = (volume: Percentage) => {
  return volume / 100;
};

export const getDataByType = <T,>(
  type: "music" | "effect",
  firstTypeResult: T,
  secondTypeResult: T
): T => {
  if (type === "music") {
    return firstTypeResult;
  }
  return secondTypeResult;
};
