export function setBackground({ background }) {
  return {
    type: 'set_background',
    payload: {
      background: background
    }
  };
}
