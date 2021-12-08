import "pixi.js-legacy";
import * as PIXI from "pixi.js-legacy";
import { E } from "../helpers/e";
export class Entity {
    constructor(scaleExp, objectID, textureLow) {
        this.culled = false;
        this.cachePeriod = true;
        this.hiddenSprites = false;
        this.isHighQuality = false;
        this.safetyPeriod = true;
        this.scaleExp = scaleExp;
        this.objectID = objectID;
        this.container = new PIXI.Container();
        setTimeout(() => (this.safetyPeriod = false), 5000);
        const scale = E(this.scaleExp);
        const spriteLow = new PIXI.Sprite(textureLow);
        spriteLow.anchor.set(0.5, 0.5);
        this.container.scale = new PIXI.Point(scale, scale);
        this.spriteLow = spriteLow;
        // default visibility
        this.spriteLow.visible = true;
        this.container.addChild(this.spriteLow);
    }
    createHighTexture(objID, texture) {
        const sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5, 0.5);
        this.sprite = sprite;
        this.sprite.visible = true;
        this.container.addChild(this.sprite);
        this.setItemQuality(true);
        this.setQuality(1);
    }
    getContainer() {
        return this.container;
    }
    setZoom(globalZoomExp, deltaZoom) {
        const scale = E(this.scaleExp - globalZoomExp);
        this.container.scale = new PIXI.Point(scale, scale);
    }
    setQuality(qualityIndex) {
        this.sprite ? this.sprite.visible = qualityIndex === 1 : 'bloopdy bloo';
        this.spriteLow.visible = qualityIndex === 0;
    }
    clearHighTexture() {
        // this.sprite ? this.sprite.destroy() : 'boop';
        // this.sprite = null
        this.setItemQuality(false);
        this.setQuality(0);
    }
    setItemQuality(isHigh) {
        this.isHighQuality = isHigh;
        if (this.sprite)
            this.sprite.visible = this.isHighQuality;
        this.spriteLow.visible = !this.isHighQuality;
    }
    cull(scale, sizeData) {
        //E(3) => 10^3
        // basic culling :)
        // if ((scale < .001 || scale > 12) && !this.cachePeriod) {
        if (scale < 0.001 || scale > 12) {
            // if (scale < (E(-6)) || scale > E(1)) {
            this.container.renderable = false;
            this.culled = true;
        }
        else {
            this.container.renderable = true;
            this.culled = false;
        }
        // low-res for distant objects. Hacked into cull :)
        if (scale < 0.075 || !this.isHighQuality) {
            this.setQuality(0);
        }
        else {
            this.setQuality(1);
        }
    }
}
