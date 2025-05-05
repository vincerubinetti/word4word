import { ref } from "vue";
import { useActiveElement, usePrevious } from "@vueuse/core";

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

/** revert focus to previously focused element */
export const usePrevFocus = () => {
  const current = useActiveElement();
  const previous = usePrevious(current);
  const revert = () => {
    previous.value?.focus();
    previous.value?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };
  return { current, previous, revert };
};
