const totalFiles = 19;

export function loading(state = {}, action) {
  let newState = state;

  if (newState === null)
    return newState;

  switch (action.type) {
    case 'set_loading':
      if (!newState.files)
        newState.files = {};

      if (action.payload.id && action.payload.loaded && action.payload.total) {
        newState.files[action.payload.id] = {
          loaded: action.payload.loaded,
          total: action.payload.total
        };
      }

      newState.percent = getPercent(newState.files);
      if (
        newState.percent === 1 &&
        Object.keys(newState.files).length === totalFiles
      )
        newState = null;

      break;

    default:
      break;
  }

  return newState;
}

function getPercent(files) {
  let loaded = 0;
  let total = 0;
  for (const key of Object.keys(files)) {
    loaded += files[key].loaded;
    total += files[key].total;
  }

  let percent = loaded / Math.max(total, 1);
  if (percent > 0.99)
    percent = 1;

  return percent;
}
