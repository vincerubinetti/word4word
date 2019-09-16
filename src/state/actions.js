export function setLoadProgress({ id, loaded, total }) {
  return {
    type: 'set_load_progress',
    payload: {
      id: id,
      loaded: loaded,
      total: total
    }
  };
}

export function setScreen({ screen }) {
  return {
    type: 'set_screen',
    payload: {
      screen: screen
    }
  };
}
