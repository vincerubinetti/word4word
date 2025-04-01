import { ref, shallowRef } from "vue";

/** simple async manager/wrapper */
export const useQuery = <Data, Args extends unknown[]>(
  func: (...args: Args) => Promise<Data>,
) => {
  /** state */
  const status = ref<"" | "loading" | "error" | "success">("");

  /** results */
  const data = shallowRef<Data>();
  /** https://github.com/vuejs/composition-api/issues/483 */

  /** wrapped async function */
  async function run(...args: Args): Promise<void> {
    try {
      status.value = "loading";
      const result = await func(...args);
      data.value = result;
      status.value = "success";
    } catch (error) {
      console.error(error);
      status.value = "error";
    }
  }

  return { run, data, status };
};
