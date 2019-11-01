export function getType(val) {
  const typeRE = /^\[object (\w+)\]$/;
  return Object.prototype.toString.call(val).match(typeRE)[1];
}
