import { useStorage } from "@vueuse/core";

/** typed storage interface */
export const savedGames = useStorage<
  Record<string, { a: string[]; b: string[]; won: boolean }>
>("saved-games", {});
