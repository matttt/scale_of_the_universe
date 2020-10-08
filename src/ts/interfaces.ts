export interface textDatum {
  title: string;
  description: string;
  metersPlural: string;
  meterSingular: string;
}

export interface VisualLocation {
  boundX: number;
  boundY: number;
  boundW: number;
  boundH: number;
  titleX: number;
  titleY: number;
  titleScale: number;
  titleWrap: boolean;
  descriptionX: number;
  descriptionY: number;
  descriptionScale?: number;
  zoomOffset?: number;
}

export interface SizeData {
  objectID: number;
  exponent: number;
  coeff: number;
  cullFac: number;
  realRatio: number;
}

export interface ExtraText {
  centimeter: string;
  centimeters: string;
  lightyear: string;
  lightyears: string;
  meter: string;
  meters: string;
}
