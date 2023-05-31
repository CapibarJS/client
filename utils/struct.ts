export function objectSet(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) current[key] = {};
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
}

export function objectGet(obj, key) {
  const keys = key.split('.');
  let current = obj;
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (!current[k]) return undefined;
    current = current[k];
  }
  return current;
}
