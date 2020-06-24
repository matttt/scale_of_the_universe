import "pixi.js-legacy";
import * as PIXI from "pixi.js-legacy";
import { E } from "../helpers/e";

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
  public cachePeriod: boolean = true;
  public hiddenSprites: boolean = false;
  public isHighQuality: boolean = true;

  public container: PIXI.Container;

  safetyPeriod: boolean = true;

  constructor(scaleExp: number, textures: PIXI.Texture[]) {
    this.scaleExp = scaleExp;
    this.texture = textures[0];
    this.textureLow = textures[1];

    this.container = new PIXI.Container();

    setTimeout(() => (this.safetyPeriod = false), 5000);

    const scale = E(this.scaleExp);
    const sprite = new PIXI.Sprite(this.texture);
    const spriteLow = new PIXI.Sprite(this.textureLow);

    sprite.anchor.set(0.5, 0.5);
    spriteLow.anchor.set(0.5, 0.5);
    sprite.cacheAsBitmap = false;

    this.container.scale = new PIXI.Point(scale, scale);

    this.sprite = sprite;
    this.spriteLow = spriteLow;

    // default visibility
    this.sprite.visible = true;
    this.spriteLow.visible = true;

    this.container.addChild(this.spriteLow, this.sprite);
  }

  getContainer() {
    return this.container;
  }

  setZoom(globalZoomExp: number, deltaZoom: number) {
    const scale = E(this.scaleExp - globalZoomExp);

    this.container.scale = new PIXI.Point(scale, scale);
  }

  setQuality(qualityIndex: number) {
    this.sprite.visible = qualityIndex === 1;
    this.spriteLow.visible = qualityIndex === 0;
  }

  clearHighTexture() {
    this.sprite.destroy({ baseTexture: true, texture: true });
  }

  setItemQuality(isHigh: boolean): void {
    this.isHighQuality = isHigh;

    this.sprite.visible = this.isHighQuality;
    this.spriteLow.visible = !this.isHighQuality;
  }

  cull(scale: number, sizeData: any) {
    //E(3) => 10^3
    // basic culling :)
    // if ((scale < .001 || scale > 12) && !this.cachePeriod) {
    if (scale < 0.001 || scale > 12) {
      // if (scale < (E(-6)) || scale > E(1)) {
      this.container.renderable = false;
      this.culled = true;

      // if (!this.safetyPeriod && this.sprite._destroyed) {
      //   this.sprite.destroy();
      //   this.spriteLow.destroy();
      // }
    } else {
      this.container.renderable = true;
      this.culled = false;

      // if (!this.safetyPeriod) {
      //   this.spriteLow = new PIXI.Sprite(this.textureLow);
      //   this.sprite = new PIXI.Sprite(this.texture);
      // }
    }

    // low-res for distant objects. Hacked into cull :)
    if (scale < 0.075 || !this.isHighQuality) {
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
