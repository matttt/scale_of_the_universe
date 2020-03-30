import * as PIXI from 'pixi.js';
import { Entity } from './entity';
import { E } from "../helpers/e";

interface visualLocation {
  "boundX": number,
  "boundY": number,
  "boundW": number,
  "boundH": number,
  "titleX": number,
  "titleY": number,
  "titleScale": number,
  "titleWrap": boolean,
  "descriptionX": number,
  "descriptionY": number
}
interface sizeData {
  "objectID": number,
  "exponent": number,
  "coeff": number,
  "cullFac": number,
  "realRatio": number
}

interface textDatum {
  "title": string,
  "description": string
}

export class Ring extends Entity {
  private coeff: number = 1;
  private realRatio: number = 1;
  private visualLocation: visualLocation;
  private textDatum: textDatum;
  private text: PIXI.Text;
  private descriptionText: PIXI.Text;
  private onClick: Function;
  private idx: number;
  private sizeData: sizeData;

  constructor(idx: number, sizeData: sizeData, textures: PIXI.Texture[], visualLocation: visualLocation, textDatum: textDatum) {
    super(sizeData.exponent, textures);

    this.idx = idx;
    this.coeff = sizeData.coeff;
    this.realRatio = sizeData.realRatio;
    this.visualLocation = visualLocation;
    this.textDatum = textDatum;
    this.sizeData = sizeData;

    // this.onClick = onClick;

    const scale = E(this.scaleExp) * this.coeff * this.realRatio;
    this.container.scale = new PIXI.Point(scale, scale);

    this.createText();
  }

  setZoom(globalZoomExp: number) {
    const scaleExp = this.scaleExp - globalZoomExp;

    if (!this.culled) {
      this.cull(scaleExp, this.sizeData)
      
      const scale = E(scaleExp) * this.coeff * this.realRatio;
      this.container.scale = new PIXI.Point(scale, scale)
      } else {
      const scaleExp = this.scaleExp - globalZoomExp;
      this.cull(scaleExp, this.sizeData)
    }
  }

  createText() {
    //make method
    let textStyle = { fontSize: 60, fill: 0x777777, align: 'center', wordWrap: false, breakWords: false };
    let descriptionStyle = { fontSize: 40, fill: 0x777777, align: 'center', wordWrap: false, breakWords: false };
    const scale = E(this.scaleExp) * this.coeff * this.realRatio;

    if (scale > E(5)) {
      textStyle.fill = 0xDDDDDD
      descriptionStyle.fill = 0xDDDDDD
    }

    this.text = new PIXI.Text(this.textDatum.title, textStyle);
    this.text.anchor.set(.5, 0)
    this.text.cacheAsBitmap = true;

    this.text.position.x = 0;
    this.text.position.y = -250;


    this.descriptionText = new PIXI.Text(this.textDatum.description, descriptionStyle);
    this.descriptionText.anchor.set(.5, 0)
    this.descriptionText.cacheAsBitmap = true;

    this.descriptionText.position.x = 0;
    this.descriptionText.position.y = 175;

    this.container.addChild(this.text, this.descriptionText)
  }

}