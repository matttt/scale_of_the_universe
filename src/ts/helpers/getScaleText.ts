export function getScaleText(exponent: number) {
  if (exponent < 0) {
    return '0.' + '0'.repeat(Math.abs(exponent) - 1) + '1'
  } else {
    return '1' + ',000'.repeat(Math.floor(exponent/3))
  } 
}