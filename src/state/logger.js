export const logger = (store) => (next) => (action) => {
  console.groupCollapsed(action.type);
  console.group('%cprev state', 'color: grey');
  console.log(store.getState());
  console.groupEnd();
  console.group('%caction', 'color: blue');
  console.log(action);
  console.groupEnd();
  const results = next(action);
  console.group('%cnext state', 'color: green');
  console.log(store.getState());
  console.groupEnd();
  console.groupEnd();
  return results;
};
