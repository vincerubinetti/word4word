import { loadData } from "@/data/word";
import { useQuery } from "@/util/composables";

/** game data */
const query = useQuery(loadData);
export const run = query.run;
export const data = query.data;
export const status = query.status;
