import 'pixi.js-legacy';
import * as PIXI from "pixi.js-legacy";
import { map } from '../helpers/map';
export class ScaleText {
    constructor(x, y, text) {
        // flipped I know... in a big hurry
        this.textColor = 0x000000;
        this.textColorSpace = 0xFFFFFF;
        this.baseTextGround = new PIXI.Text('10', {
            fontFamily: "Arial",
            fontSize: 32,
            fill: this.textColor,
            stroke: this.textColor,
            align: "center",
        });
        this.textGround = new PIXI.Text(text, {
            fontFamily: "Arial",
            fontSize: 14,
            fill: this.textColor,
            stroke: this.textColor,
            align: "left",
        });
        this.baseTextSpace = new PIXI.Text('10', {
            fontFamily: "Arial",
            fontSize: 32,
            fill: this.textColorSpace,
            stroke: this.textColorSpace,
            align: "center",
        });
        this.textSpace = new PIXI.Text(text, {
            fontFamily: "Arial",
            fontSize: 14,
            fill: this.textColorSpace,
            stroke: this.textColorSpace,
            align: "left",
        });
        this.containerSpace = new PIXI.Container();
        this.containerGround = new PIXI.Container();
        this.containerSpace.addChild(this.baseTextSpace, this.textSpace);
        this.containerGround.addChild(this.baseTextGround, this.textGround);
        this.container = new PIXI.Container();
        this.container.addChild(this.containerGround, this.containerSpace);
        this.textGround.x = x + 27;
        this.textGround.y = y;
        this.textSpace.x = x + 27;
        this.textSpace.y = y;
        this.baseTextGround.x = x - 10;
        this.baseTextGround.y = y;
        this.baseTextSpace.x = x - 10;
        this.baseTextSpace.y = y;
    }
    setText(str) {
        this.textSpace.text = Number(str).toFixed(1);
        this.textGround.text = Number(str).toFixed(1);
    }
    setColor(scaleExp) {
        if (scaleExp > 5) {
            let opacity = map(scaleExp, 5, 7, 0.1, 1);
            this.containerSpace.alpha = opacity;
        }
        else {
            this.containerSpace.alpha = 0.1;
        }
    }
}
