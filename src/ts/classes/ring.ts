import * as PIXI from "pixi.js";
import { Entity } from "./entity";
import { E } from "../helpers/e";
import { MotionBlurFilter } from "@pixi/filter-motion-blur";
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

  constructor(
    idx: number,
    sizeData: sizeData,
    textures: PIXI.Texture[],
    visualLocation: visualLocation,
    textDatum: textDatum
  ) {
    super(sizeData.exponent, textures);

    this.idx = idx;
    this.coeff = sizeData.coeff;
    this.realRatio = sizeData.realRatio;
    this.visualLocation = visualLocation;
    this.textDatum = textDatum;
    this.sizeData = sizeData;

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

      this.cull(scaleExp, this.sizeData);

      const scale = E(scaleExp) * this.coeff * this.realRatio;

      this.textContainer.alpha = map(scale, 0.1, 0.2, 0, 1);
      this.textContainer.visible = this.textContainer.alpha !== 0;


      this.container.scale = new PIXI.Point(scale, scale);
    } else {
      const scaleExp = this.scaleExp - globalZoomExp;
      this.cull(scaleExp, this.sizeData);
    }
  }

  createText() {
    //make method
    let textStyle = {
      fontFamily: 'Roboto',
      fontSize: 60,
      fill: 0x777777,
      align: "center",
      wordWrap: false,
      breakWords: false
    };
    let descriptionStyle = {
      fontFamily: 'Roboto',
      fontSize: 40,
      fill: 0x777777,
      align: "center",
      wordWrap: false,
      breakWords: false
    };
    const scale = E(this.scaleExp) * this.coeff * this.realRatio;

    if (scale > E(5)) {
      textStyle.fill = 0xdddddd;
      descriptionStyle.fill = 0xdddddd;
    }

    this.text = new PIXI.Text(this.textDatum.title, textStyle);
    this.text.anchor.set(0.5, 0);
    // this.text.cacheAsBitmap = true;

    this.text.position.x = 0;
    this.text.position.y = -250;

    this.descriptionText = new PIXI.Text(
      this.textDatum.description,
      descriptionStyle
    );
    this.descriptionText.anchor.set(0.5, 0);
    // this.descriptionText.cacheAsBitmap = true;

    this.descriptionText.position.x = 0;
    this.descriptionText.position.y = 175;

    this.textContainer = new PIXI.Container();
    this.textContainer.addChild(this.text, this.descriptionText);

    this.container.addChild(this.textContainer);
  }
}
