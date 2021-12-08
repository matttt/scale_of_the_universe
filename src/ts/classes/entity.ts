import {
  Sprite,
  Container,
  Texture,
  Point 
} from "pixi.js-legacy";
import { E } from "../helpers/e";

export class Entity {
  public scaleExp: number;
  protected sprite: Sprite;
  protected video: Sprite;
  public videoStream: any;
  protected spriteLow: Sprite;
  protected spriteMedium: Sprite;
  public culled: boolean = false;
  public cachePeriod: boolean = true;
  public hiddenSprites: boolean = false;
  public isHighQuality: boolean = false;
  public objectID: number;

  public container: Container;

  safetyPeriod: boolean = true;

  constructor(scaleExp: number, objectID: number, textureLow: Texture) {
    this.scaleExp = scaleExp;

    this.objectID = objectID;
    this.container = new Container();

    setTimeout(() => (this.safetyPeriod = false), 5000);

    const scale = E(this.scaleExp);

    const spriteLow = new Sprite(textureLow);

    spriteLow.anchor.set(0.5, 0.5);
    spriteLow.zIndex = 0;

    this.container.scale = new Point(scale, scale);

    this.spriteLow = spriteLow;

    // default visibility

    this.spriteLow.visible = true;

    this.container.addChild(this.spriteLow);
  }

  createHighTexture(objID: Number, texture: Texture) {
    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5, 0.5);
    this.sprite = sprite;
    this.sprite.visible = true;
    this.sprite.zIndex = 1;
    this.container.addChild(this.sprite);

    this.setItemQuality(true)
    this.setQuality(1)
  }

  getContainer() {
    return this.container;
  }

  setZoom(globalZoomExp: number, deltaZoom: number) {
    const scale = E(this.scaleExp - globalZoomExp);

    this.container.scale = new Point(scale, scale);
  }

  setQuality(qualityIndex: number) {
      if (this.sprite) {
        this.sprite.visible = qualityIndex === 1
      }

      this.spriteLow.visible = qualityIndex === 0;
  }

  clearHighTexture() {
    // if(this.sprite) this.sprite.destroy();
    // this.sprite = null
    this.setItemQuality(false);
    this.setQuality(0)
  }

  public setItemQuality(isHigh: boolean): void {
    this.isHighQuality = isHigh;

    if (this.sprite) {
      this.sprite.visible = this.isHighQuality;
    }
    this.spriteLow.visible = !this.isHighQuality;
  }

  cull(scale: number, sizeData: any) {
    //E(3) => 10^3
    // basic culling :)
    // if ((scale < .001 || scale > 12) && !this.cachePeriod) {
    if (scale < 0.001 || scale > 12) {
      this.container.renderable = false;
      this.culled = true;
    } else {
      this.container.renderable = true;
      this.culled = false;
    }

    // low-res for distant objects. Hacked into cull 
    if (scale < 0.075 || !this.isHighQuality) {
      this.setQuality(0);
    } else {
      this.setQuality(1);
    }

  }
}
