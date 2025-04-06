import { ref } from "vue";
// import { sleep } from "@/util/misc";

/** simple async manager/wrapper */
export const useQuery = <Data, Args extends unknown[]>(
  func: (...args: Args) => Promise<Data>,
) => {
  /** state */
  const status = ref<"" | "loading" | "error" | "success">("");

  /** results */
  const data = ref<Data>();

  /** wrapped async function */
  async function run(...args: Args): Promise<void> {
    try {
      data.value = undefined;
      status.value = "loading";
      // await sleep(1000);
      const result = await func(...args);
      data.value = result;
      status.value = "success";
    } catch (error) {
      console.error(error);
      data.value = undefined;
      status.value = "error";
    }
  }

  return { run, data, status };
};
