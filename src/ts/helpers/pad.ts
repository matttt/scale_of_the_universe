export function pad(str: any, max: number): String {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}