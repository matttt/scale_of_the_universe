import * as PIXI from "pixi.js-legacy";
import { Entity } from "./entity";
import { E } from "../helpers/e";
import { getGraphics } from "../helpers/description";
export class Item extends Entity {
    constructor(sizeData, textureLow, visualLocation, textDatum, extraText, units, onClick) {
        super(sizeData.exponent, sizeData.objectID, textureLow);
        this.coeff = 1;
        this.realRatio = 1;
        this.currentScale = 1;
        this.extraText = extraText;
        this.coeff = sizeData.coeff;
        this.realRatio = sizeData.realRatio;
        this.visualLocation = visualLocation;
        this.textDatum = textDatum;
        this.sizeData = sizeData;
        this.units = units;
        const dX = window.innerWidth / 2 - textureLow.trim.x + textureLow.trim.width / 2;
        const dY = window.innerHeight / 2 - textureLow.trim.y + textureLow.trim.height / 2;
        var c = Math.sqrt(dX * dX + dY * dY);
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
        const descriptionGfx = getGraphics(this.visualLocation, this.textDatum, this.extraText, this.units, this.sizeData);
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
    setZoom(globalZoomExp, deltaZoom) {
        const scaleExp = this.scaleExp - globalZoomExp;
        if (!this.culled) {
            const scale = E(scaleExp) * this.coeff * this.realRatio;
            if (scale > 0.05 && scale < 0.1) {
                this.text.alpha = 0.5;
            }
            else if (scale > 0.1) {
                this.text.alpha = 1;
            }
            else if (this.text.alpha !== 0) {
                this.text.alpha = 0;
            }
            if (this.cachePeriod) {
                this.text.alpha = 1;
            }
            this.text.visible = this.text.alpha !== 0;
            this.cull(scale, this.sizeData);
            this.container.scale = new PIXI.Point(scale, scale);
            this.currentScale = scale;
            // this.text.opacity = Math.min(0, scaleExp);
        }
        else {
            const scaleExp = this.scaleExp - globalZoomExp;
            if (scaleExp > 2 || scaleExp < -4) {
                this.cull(E(-8), this.sizeData);
            }
            else {
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
            fontFamily: "Roboto",
            fontSize: 48 * this.visualLocation.titleScale,
            fill: 0x000000,
            align: "center",
            wordWrap: this.visualLocation.titleWrap,
            wordWrapWidth: 400,
        };
        const scale = E(this.scaleExp) * this.coeff * this.realRatio;
        if (scale > E(5)) {
            textStyle.fill = 0xdddddd;
        }
        this.text = new PIXI.Text(this.textDatum.title, textStyle);
        this.text.anchor.set(0.5, 0);
        this.text.position.x = this.visualLocation.titleX;
        this.text.position.y = this.visualLocation.titleY;
        this.text.cacheAsBitmap = false;
        this.container.addChild(this.text);
    }
    createClickableRegion() {
        this.setSpriteEvents(this.spriteLow);
        const here = this;
        function onButtonDown() {
            here.onClick(here);
            sa_event("item_" + here.sizeData.objectID.toString());
        }
    }
    setHighSpriteEvents() {
        this.setSpriteEvents(this.sprite);
    }
    setSpriteEvents(sprite) {
        const bX1 = this.visualLocation.boundX;
        const bY1 = this.visualLocation.boundY;
        const bX2 = bX1 + this.visualLocation.boundW;
        const bY2 = bY1 + this.visualLocation.boundH;
        const points = [
            new PIXI.Point(bX1, bY1),
            new PIXI.Point(bX2, bY1),
            new PIXI.Point(bX2, bY2),
            new PIXI.Point(bX1, bY2),
        ];
        const here = this;
        function onButtonDown() {
            here.onClick(here);
            // sa_event("item_" + here.sizeData.objectID.toString());
        }
        sprite.hitArea = new PIXI.Polygon(points);
        sprite.buttonMode = true; //false makes mouse cursor not change when on item
        sprite.interactive = true;
        sprite.on("mousedown", onButtonDown).on("touchstart", onButtonDown);
    }
}
