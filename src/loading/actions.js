export function setLoading({ id, loaded, total }) {
  return {
    type: 'set_loading',
    payload: {
      id: id,
      loaded: loaded,
      total: total
    }
  };
}