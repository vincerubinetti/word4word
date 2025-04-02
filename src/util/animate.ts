export const error = (element?: Element | null) =>
  element?.animate([{ background: "var(--error)" }, { background: "" }], {
    duration: 1000,
    iterations: 1,
  });
