import * as PIXI from 'pixi.js';
import { Entity } from './entity';
import { E } from "../helpers/e";
import { getGraphics } from "../helpers/description"


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

export class Item extends Entity {
  public descriptionGraphics: PIXI.Container;

  public coeff: number = 1;
  public sizeData: sizeData;
  public realRatio: number = 1;
  public currentScale: number = 1;
  private visualLocation: visualLocation;
  private textDatum: textDatum;
  private text: PIXI.Text;
  private onClick: Function;
  private description: PIXI.Container;

  constructor(sizeData: sizeData, textures: PIXI.Texture[], visualLocation: visualLocation, textDatum: textDatum, onClick: Function) {
    super(sizeData.exponent, textures);

    this.coeff = sizeData.coeff;
    this.realRatio = sizeData.realRatio;
    this.visualLocation = visualLocation;
    this.textDatum = textDatum;
    this.sizeData = sizeData;

    this.onClick = onClick;

    const scale = E(this.scaleExp) * this.coeff * this.realRatio;
    this.container.scale = new PIXI.Point(scale, scale);

    this.createClickableRegion();
    this.createText();
    this.cull(scale, this.sizeData)
  }

  showDescription() {
    const descriptionGfx = getGraphics(this.visualLocation, this.textDatum, this.sizeData);

    this.container.addChild(descriptionGfx);

    this.description = descriptionGfx;
  }

  hideDescription() {
    if (this.description) {
      this.container.removeChild(this.description)
    }
  }

  setZoom(globalZoomExp: number) {
    const scaleExp = this.scaleExp - globalZoomExp;

    if (!this.culled) {
      this.cull(scaleExp, this.sizeData)
      
      const scale = E(scaleExp) * this.coeff * this.realRatio;
      this.container.scale = new PIXI.Point(scale, scale)
      this.currentScale = scale;
      } else {
      const scaleExp = this.scaleExp - globalZoomExp;
      this.cull(scaleExp, this.sizeData)
    }


  }

  getScale() {
    return this.currentScale;
  }

  createText() {
    const textStyle = { 
      fontSize: 48 * this.visualLocation.titleScale, 
      fill: 0x000000, 
      align: 'center', 
      wordWrap: this.visualLocation.titleWrap, 
      wordWrapWidth: 400 
    };

    const scale = E(this.scaleExp) * this.coeff * this.realRatio;

    if (scale > E(5)) {
      textStyle.fill = 0xDDDDDD
    }


    this.text = new PIXI.Text(this.textDatum.title, textStyle);
    this.text.anchor.set(.5, 0)

    this.text.position.x = this.visualLocation.titleX;
    this.text.position.y = this.visualLocation.titleY;

    // setTimeout(()=> {
    //   // this.text.cacheAsBitmap = true;
    // }, 500)

    this.container.addChild(this.text)

  }

  createClickableRegion() {
    const bX1 = this.visualLocation.boundX;
    const bY1 = this.visualLocation.boundY;
    const bX2 = bX1 + this.visualLocation.boundW;
    const bY2 = bY1 + this.visualLocation.boundH;

    const points = [new PIXI.Point(bX1, bY1), new PIXI.Point(bX2, bY1), new PIXI.Point(bX2, bY2), new PIXI.Point(bX1, bY2)];
    this.sprite.hitArea = new PIXI.Polygon(points);
    this.sprite.buttonMode = true; //false makes mouse cursor not change when on item
    this.sprite.interactive = true;

    // this.spriteLow.hitArea = new PIXI.Polygon(points);
    // this.spriteLow.buttonMode = true; //false makes mouse cursor not change when on item
    // this.spriteLow.interactive = true;
    
    this.spriteMedium.hitArea = new PIXI.Polygon(points);
    this.spriteMedium.buttonMode = true; //false makes mouse cursor not change when on item
    this.spriteMedium.interactive = true;
    const here = this;
    function onButtonDown ()  {
      here.onClick(here)
      // alert(this.textDatum.description)

      // here.();
    }

    this.sprite.on('mousedown', onButtonDown)
      .on('touchstart', onButtonDown)

    this.spriteLow.on('mousedown', onButtonDown)
      .on('touchstart', onButtonDown)
  }


  
}