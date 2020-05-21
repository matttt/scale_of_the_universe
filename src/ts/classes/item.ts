import * as PIXI from "pixi.js-legacy";
import { Entity } from "./entity";
import { E } from "../helpers/e";
import { map } from "../helpers/map";
import { getGraphics } from "../helpers/description";
// import { MotionBlurFilter } from "@pixi/filter-motion-blur";
import { ExtraText } from '../helpers/powToUnit';

interface VisualLocation {
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
  zoomOffset?: number
}
export interface SizeData {
  objectID: number;
  exponent: number;
  coeff: number;
  cullFac: number;
  realRatio: number;
}

interface textDatum {
  title: string;
  description: string;
  metersPlural: string;
  meterSingular: string;
}

export class Item extends Entity {
  public descriptionGraphics: PIXI.Container;

  public coeff: number = 1;
  public sizeData: SizeData;
  public realRatio: number = 1;
  public currentScale: number = 1;
  public visualLocation: VisualLocation;
  public video: PIXI.Sprite;
  public app: PIXI.Application;
  public videoSrc: any;
  private textDatum: textDatum;
  public text: PIXI.Text;
  private onClick: Function;
  private description: PIXI.Container;
  private units: Array<string>;
  private extraText: ExtraText;

  private centerVec: PIXI.Point;

  constructor(
    sizeData: SizeData,
    textures: PIXI.Texture[],
    visualLocation: VisualLocation,
    textDatum: textDatum,
    extraText: ExtraText,
    units: Array<string>,
    onClick: Function,
    app: PIXI.Application
  ) {
    super(sizeData.exponent, textures);

    this.extraText = extraText;

    this.coeff = sizeData.coeff;
    this.realRatio = sizeData.realRatio;
    this.visualLocation = visualLocation;
    this.textDatum = textDatum;
    this.sizeData = sizeData;
    this.units = units;

    const dX =
      window.innerWidth / 2 - this.texture.trim.x + this.texture.trim.width / 2;
    const dY =
      window.innerHeight / 2 -
      this.texture.trim.y +
      this.texture.trim.height / 2;

    var c = Math.sqrt(dX * dX + dY * dY);

    if (sizeData.objectID === 208) {
      this.hiddenSprites = true;
      this.app = app
      this.setScreenImage()
    }

    this.centerVec = new PIXI.Point(dX / c, dY / c);

    this.onClick = onClick;

    const scale = E(this.scaleExp) * this.coeff * this.realRatio;
    this.container.scale = new PIXI.Point(scale, scale);

    this.createClickableRegion();
    this.createText();
    this.cull(scale, this.sizeData);
  }

  showDescription() {
    this.text.visible = false;

    const descriptionGfx = getGraphics(
      this.visualLocation,
      this.textDatum,
      this.extraText,
      this.units,
      this.sizeData
    );

    const s = this.visualLocation.descriptionScale;
    if (s) {
      descriptionGfx.scale = new PIXI.Point(s, s);
    }

    this.container.addChild(descriptionGfx);

    this.description = descriptionGfx;
  }

  hideDescription() {
    this.text.visible = true;
    if (this.description) {
      this.container.removeChild(this.description);
    }
  }

  enableMotionBlur() {}

  async setScreenImage() {
    // try {
    //   //     // create a new Sprite using the video texture (yes it's that easy)
    //   // const texture = PIXI.Texture.from('img/miniScreen.mp4');
    //   // const videoSprite = new PIXI.Sprite(texture);

    //   // const videoResource: any = texture.baseTexture.resource;
    //   // const canv:any = this.app.renderer.view;
    //   // this.videoStream = canv.captureStream(30);

    //   // // console.log(this.videoStream.getTracks()[0])

    //   // videoResource.source.srcObject = this.videoStream;

    //   // videoSprite.position.x = -430;
    //   // videoSprite.position.y = 125;
    //   // videoSprite.width = this.texture.trim.width;
    //   // videoSprite.height = this.texture.trim.height;

    //   // this.video = videoSprite;
    //   // this.container.addChild(videoSprite);
    // } catch (err) {
    //   console.log('stream failed')
    //   this.hiddenSprites = false;
    // }
    
  }

  setZoom(globalZoomExp: number, deltaZoom: number) {
    const scaleExp = this.scaleExp - globalZoomExp;
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

    if (!this.culled) {
      const scale = E(scaleExp) * this.coeff * this.realRatio;

      this.text.alpha = map(scale, 0.1, 0.2, 0, 1);
      this.text.visible = this.text.alpha !== 0;

      this.cull(scale, this.sizeData);
      this.container.scale = new PIXI.Point(scale, scale);
      this.currentScale = scale;

      // this.text.opacity = Math.min(0, scaleExp);
    } else {      
      const scaleExp = this.scaleExp - globalZoomExp;
      if (scaleExp > 2 || scaleExp < -4) {
        this.cull(E(-4), this.sizeData);
      } else {
        const scale = E(scaleExp) * this.coeff * this.realRatio;
        this.cull(scale, this.sizeData);
      }
    }
  }

  getScale() {
    return this.currentScale;
  }

  createText() {
    const textStyle = {
      fontFamily: 'Roboto',
      fontSize: 48 * this.visualLocation.titleScale,
      fill: 0x000000,
      align: "center",
      wordWrap: this.visualLocation.titleWrap,
      wordWrapWidth: 400
    };

    const scale = E(this.scaleExp) * this.coeff * this.realRatio;

    if (scale > E(5)) {
      textStyle.fill = 0xdddddd;
    }

    this.text = new PIXI.Text(this.textDatum.title, textStyle);
    this.text.anchor.set(0.5, 0);

    this.text.position.x = this.visualLocation.titleX;
    this.text.position.y = this.visualLocation.titleY;

    // setTimeout(()=> {
    //   // this.text.cacheAsBitmap = true;
    // }, 500)

    this.container.addChild(this.text);
  }

  createClickableRegion() {
    const bX1 = this.visualLocation.boundX;
    const bY1 = this.visualLocation.boundY;
    const bX2 = bX1 + this.visualLocation.boundW;
    const bY2 = bY1 + this.visualLocation.boundH;

    const points = [
      new PIXI.Point(bX1, bY1),
      new PIXI.Point(bX2, bY1),
      new PIXI.Point(bX2, bY2),
      new PIXI.Point(bX1, bY2)
    ];


    this.sprite.hitArea = new PIXI.Polygon(points);
    this.sprite.buttonMode = true; //false makes mouse cursor not change when on item
    this.sprite.interactive = true;

    this.spriteLow.hitArea = new PIXI.Polygon(points);
    this.spriteLow.buttonMode = true; //false makes mouse cursor not change when on item
    this.spriteLow.interactive = true;

    // if (this.sizeData.objectID === 208 && this.video) {
    //   console.log('video box set')
    //   this.video.hitArea = new PIXI.Polygon(points);
    //   this.video.interactive = true;
    //   this.video.buttonMode = true;
    // }

    const here = this;
    function onButtonDown() {
      here.onClick(here);
      // alert(this.textDatum.description)

      // here.();
    }

    this.sprite.on("mousedown", onButtonDown).on("touchstart", onButtonDown);
    this.spriteLow.on("mousedown", onButtonDown).on("touchstart", onButtonDown);

    if (this.video) this.video.on("mousedown", onButtonDown).on("touchstart", onButtonDown);
  }
}
