export const deepClone = (src: any) => {
  return JSON.parse(JSON.stringify(src))
}