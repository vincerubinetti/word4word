export function setScreen({ screen }) {
  return {
    type: 'set_screen',
    payload: {
      screen: screen
    }
  };
}
