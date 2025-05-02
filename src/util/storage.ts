import { useStorage } from "@vueuse/core";

export type SavedGame = {
  a: string[];
  b: string[];
  won?: boolean;
  par?: number;
  started?: string;
  type?: string;
};

/** typed storage interface */
export const savedGames = useStorage<Record<string, SavedGame>>(
  "saved-games",
  {},
);
