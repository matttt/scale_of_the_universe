import 'pixi.js-legacy';
import * as PIXI from "pixi.js-legacy";
import {E} from "../helpers/e";

export class Entity {
  public scaleExp: number;
  protected texture: PIXI.Texture;
  protected textureLow: PIXI.Texture;
  protected sprite: PIXI.Sprite;
  protected video: PIXI.Sprite;
  public videoStream: any;
  protected spriteLow: PIXI.Sprite;
  protected spriteMedium: PIXI.Sprite;
  public culled: boolean = false;
  public hiddenSprites: boolean = false;
  public isHighQuality: boolean = true;

  public container: PIXI.Container;

  constructor(scaleExp: number, textures: PIXI.Texture[]) {
    this.scaleExp = scaleExp;
    this.texture = textures[0];
    this.textureLow = textures[1];

    this.container = new PIXI.Container();

    const scale = E(this.scaleExp)
    const sprite = new PIXI.Sprite(this.texture);
    const spriteLow = new PIXI.Sprite(this.textureLow);

    sprite.anchor.set(0.5, 0.5);
    spriteLow.anchor.set(0.5, 0.5);
    // sprite.cacheAsBitmap = true;

    this.container.scale = new PIXI.Point(scale, scale);

    this.sprite = sprite;
    this.spriteLow = spriteLow;

    // default visibility
    this.sprite.visible = true;
    this.spriteLow.visible = true;

    
    this.container.addChild(this.spriteLow, this.sprite);
    
  } 

  getContainer () {
    return this.container;
  }

  setItemQuality(isHigh: boolean) {
    this.isHighQuality = isHigh;
  }

  setZoom (globalZoomExp: number, deltaZoom: number) {
    const scale = E(this.scaleExp - globalZoomExp);

    this.container.scale = new PIXI.Point(scale,scale)
  }

  setQuality(qualityIndex: number) {
    this.sprite.visible = qualityIndex === 1;
    this.spriteLow.visible = qualityIndex === 0;
  }

  cull(scale: number, sizeData: any) {
    //E(3) => 10^3
    // basic culling :)
    if (scale < .001 || scale > 12) {
    // if (scale < (E(-6)) || scale > E(1)) {
      this.container.visible = true;
      this.culled = true;
    } else {
      this.container.visible = true;
      this.culled = false;
    }

    // low-res for distant objects. Hacked into cull :) 
    if (scale < .075) {
      this.setQuality(0);
    } else {
      this.setQuality(1);
    }

    // if (this.videoStream && !this.culled) {
    //   this.videoStream.getTracks()[0].requestFrame()
    // }


    // if (this.hiddenSprites) {
    //   this.setQuality(4)
    // }
  }
}
