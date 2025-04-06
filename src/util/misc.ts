export const sleep = (ms = 0) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

/** simple local storage interface with typing */
export const storage = <Type>() => {
  const load = (key: string) => {
    const data = window.localStorage.getItem(key);
    if (!data) return;
    try {
      return JSON.parse(data) as Type;
    } catch (error) {
      return;
    }
  };

  const save = (key: string, data: Type) =>
    window.localStorage.setItem(key, JSON.stringify(data));

  const clear = (key: string) => window.localStorage.removeItem(key);

  return { load, save, clear };
};
