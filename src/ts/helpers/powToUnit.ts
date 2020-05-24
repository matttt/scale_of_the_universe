import {E} from './e'
import { SizeData } from '../classes/item';
import * as numeral from 'numeral';
export interface ExtraText {
  centimeter: string;
  centimeters: string;
  lightyear: string;
  lightyears: string;
  meter: string;
  meters: string;
}

export function powToUnit (sizeData: SizeData, units: string[], extra: ExtraText) {
  const groupPow = sizeData.exponent / 3;
  const unitPow = Math.floor(groupPow)
  const unitIndex = unitPow + 8; //offset in text data, example below
  
  let multiplierPow = 0;
  
  const pos = sizeData.exponent > 0
  const gropPowDec = (Math.abs(sizeData.exponent)) % 3;
  switch(gropPowDec) {
    case 1: 
      multiplierPow = pos ? 1 : 2
      break; 
    case 2: 
      multiplierPow = pos ? 2 : 1 
      break;
  }


  // 10 centimeters
  if (sizeData.exponent === -1) {
    const val = E(1) * sizeData.coeff;

    const unit = val === 1 ? extra.centimeter : extra.centimeters

    return `${val} ${unit.replace(/\r?\n|\r/g, '')}`
  }

  // single centimeters
  if (sizeData.exponent === -2) {
    const val = sizeData.coeff;

    const unit = val === 1 ? extra.centimeter : extra.centimeters

    return `${val} ${unit.replace(/\r?\n|\r/g, '')}`
  }

  // kilometers
  if (sizeData.exponent >= 3 && sizeData.exponent <= 14) {
    const kiloIndex = 9;
    const kilo = units[kiloIndex];
    const val = sizeData.coeff;

    const numKilos = Math.floor((sizeData.coeff * Math.pow(10, sizeData.exponent - 3)));

    const formattedVal = numeral(numKilos).format('0,0');

    return `${formattedVal} ${kilo}${extra.meters}`.replace(/\r?\n|\r/g, '')
  }

  //light years
  if (sizeData.exponent >= 16) {
    const numLYS = sizeData.coeff * (Math.pow(10, sizeData.exponent - 16));

    const formattedVal = numeral(numLYS).format('0,0');

    return `${formattedVal} ${sizeData.coeff === 1 ? extra.lightyear : extra.lightyears}`.replace(/\r?\n|\r/g, '')
  }

  const val = Number((E(multiplierPow) * sizeData.coeff).toFixed(3));

  const suffix = val === 1 ? extra.meter : extra.meters

  const output = `${val} ${units[unitIndex]}${suffix.replace(/\r?\n|\r/g, '')}`

  return output
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