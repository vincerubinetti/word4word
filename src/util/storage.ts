import { useStorage } from "@vueuse/core";

type SavedGame = {
  a: string[];
  b: string[];
  won: boolean;
  par: number;
};

/** typed storage interface */
export const savedGames = useStorage<Record<string, SavedGame>>(
  "saved-games",
  {},
);
