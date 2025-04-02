export const error = (element?: Element | null) =>
  element?.animate([{ outlineColor: "var(--error)" }, { outlineColor: "" }], {
    duration: 1000,
    iterations: 1,
  });
