import {E} from './e'

export function powToUnit (pow: number, units: string[]) {
  const groupPow = pow / 3;
  const unitPow = Math.floor(groupPow)
  const gropPowDec = groupPow - unitPow;
  const unitIndex = unitPow + 8; //offset in text data, example below

  let multiplier = 1;

  if (gropPowDec > 1/3 && gropPowDec < 2/3) {
    multiplier = E(1);
  } else if (gropPowDec > 2/3 && gropPowDec < 3/3) {
    multiplier = E(2);
  }

  return {
    unitText: units[unitIndex],
    multiplier
  }
}

// const units = [
//   'yocto',
//   'zepto',
//   'atto',
//   'femto',
//   'pico',
//   'nano',
//   'micro',
//   'milli',
//   '',
//   'kilo',
//   'mega',
//   'giga',
//   'tera',
//   'peta',
//   'exa',
//   'zetta',
//   'yotta'
// ]


// const tests = [
//   {expect: 'blank', actual: powToUnit(1, units)}, 
//   {expect: 'kilo', actual: powToUnit(3, units)}, 
//   {expect: 'milli', actual: powToUnit(-3, units)}, 
// ]

// for (const t of tests)
//   console.log(`expect: ${t.expect} actual ${t.actual}`)