export type Range<
  N extends number,
  T extends number[] = []
> = T["length"] extends N ? T[number] : Range<N, [...T, T["length"]]>;
