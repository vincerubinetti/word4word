export function copyObject(object) {
  try {
    return JSON.parse(JSON.stringify(object));
  } catch (error) {
    return object;
  }
}

export function filterObject(object, keys) {
  const newObject = {};
  for (const key of Object.keys(object)) {
    if (keys.includes(key))
      continue;
    newObject[key] = copyObject(object[key]);
  }
  return newObject;
}
