import 'pixi.js-legacy';
import * as PIXI from "pixi.js-legacy";
import { Entity } from "./entity";
import { E } from "../helpers/e";
// import { MotionBlurFilter } from "@pixi/filter-motion-blur";
import { map } from "../helpers/map";

interface visualLocation {
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
}
interface sizeData {
  objectID: number;
  exponent: number;
  coeff: number;
  cullFac: number;
  realRatio: number;
}

interface textDatum {
  title: string;
  description: string;
}

function supFromDig (dig: string) {
  const num = Number(dig);
  return "⁰¹²³⁴⁵⁶⁷⁸⁹".charAt(num);
}

function numToSup (num: number) {
  const str = num.toString();

  return str.replace(/[0123456789]/g, supFromDig)
            .replace(/-/g, '⁻');
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
  private textContainer: PIXI.Container;
  private centerVec: PIXI.Point;
  private meterPlural: string;

  constructor(
    idx: number,
    sizeData: sizeData,
    textures: PIXI.Texture[],
    visualLocation: visualLocation,
    textDatum: textDatum,
    metersText: string
  ) {
    super(sizeData.exponent, textures);

    this.idx = idx;
    this.coeff = sizeData.coeff;
    this.realRatio = sizeData.realRatio;
    this.visualLocation = visualLocation;
    this.textDatum = textDatum;
    this.sizeData = sizeData;

    this.meterPlural = metersText;

    const dX =
      window.innerWidth / 2 - this.texture.trim.x + this.texture.trim.width / 2;
    const dY =
      window.innerHeight / 2 -
      this.texture.trim.y +
      this.texture.trim.height / 2;

    var c = Math.sqrt(dX * dX + dY * dY);

    this.centerVec = new PIXI.Point(dX / c, dY / c);
    // this.onClick = onClick;

    const scale = E(this.scaleExp) * this.coeff * this.realRatio;
    this.container.scale = new PIXI.Point(scale, scale);

    this.createText();
  }

  setZoom(globalZoomExp: number, deltaZoom: number) {
    const scaleExp = this.scaleExp - globalZoomExp;
    if (!this.culled) {
      // if (Math.abs(deltaZoom) > 0.05) {
      //   const x = this.centerVec.x;
      //   const y = this.centerVec.y;
      //   const MOTION_BLUR_FACTOR = 100;
      //   // console.log(x,y)
      //   const mult = new PIXI.Point(
      //     x * deltaZoom * MOTION_BLUR_FACTOR,
      //     y * deltaZoom * MOTION_BLUR_FACTOR
      //   );

      //   const motionFilter = new MotionBlurFilter(mult, 3, 0);
      //   this.container.filters = [motionFilter];
      // } else {
      //   this.container.filters = [];
      // }

      
      const scale = E(scaleExp) * this.coeff * this.realRatio;
      this.cull(scale, this.sizeData);

      this.textContainer.alpha = map(scale, 0.1, 0.2, 0, 1);
      this.textContainer.visible = this.textContainer.alpha !== 0;


      this.container.scale = new PIXI.Point(scale, scale);
    } else {
      const scaleExp = this.scaleExp - globalZoomExp;
      const scale = E(scaleExp) * this.coeff * this.realRatio;

      this.cull(scale, this.sizeData);
    }
  }

  createText() {
    let baseStyle = {
      fontFamily: 'Roboto',
      fontSize: 40,
      fill: 0x777777,
      align: "center",
      wordWrap: false,
      wordWrapWidth: 1000,
      breakWords: false
    }
    //make method
    let textStyle = {
      ...baseStyle,
      fontSize: 60
    };
    let expTextStyle = {
      ...baseStyle,
      fontSize: 40
    };
    let descriptionStyle = {
      ...baseStyle
    };
    const scale = E(this.scaleExp) * this.coeff * this.realRatio;

    if (scale > E(5)) {
      textStyle.fill = 0xdddddd;
      expTextStyle.fill = 0xdddddd;
      descriptionStyle.fill = 0xdddddd;
    }
    
    //literally done. users will run a couple regexes. 
    const titleNoNewLine = this.textDatum.title.replace(/(\r\n|\n|\r)/gm, '');

    // const expText = this.sizeData.exponent;
    // const expTextFmtd = numToSup(expText);

    const exponentText = new PIXI.Text(`10^${this.sizeData.exponent} ${this.meterPlural}`, expTextStyle);

    
    const expTextContainer = new PIXI.Container();

    this.text = new PIXI.Text(titleNoNewLine, textStyle);
    this.text.anchor.set(0.5, 0);
    // this.text.cacheAsBitmap = true;
    
    exponentText.position.x = 0;
    exponentText.position.y = -225;
    // exponentText.anchor.set(0.5, 0);
    
      
    expTextContainer.addChild(exponentText)
    // expTextContainer.addChild(exponentText, expText, unitText)
    expTextContainer.position.x -= expTextContainer.width /2

    this.text.position.x = 0;
    this.text.position.y = -300;

    this.descriptionText = new PIXI.Text(
      this.textDatum.description,
      descriptionStyle
    );
    this.descriptionText.anchor.set(0.5, 0);
    // this.descriptionText.cacheAsBitmap = true;

    this.descriptionText.position.x = 0;
    this.descriptionText.position.y = 175;

    this.textContainer = new PIXI.Container();
    this.textContainer.addChild(this.text, this.descriptionText, expTextContainer);

    this.container.addChild(this.textContainer);
  }
}
