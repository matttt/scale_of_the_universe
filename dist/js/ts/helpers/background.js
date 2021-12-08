import 'pixi.js-legacy';
import { Container, Graphics, Point } from 'pixi.js-legacy';
export function background(bgSize, inputSprite, type, forceSize) {
    let sprite = inputSprite;
    let bgContainer = new Container();
    let mask = new Graphics().beginFill(0x8bc5ff).drawRect(0, 0, bgSize.x, bgSize.y).endFill();
    bgContainer.mask = mask;
    bgContainer.addChild(mask);
    bgContainer.addChild(sprite);
    let sp = { x: sprite.width, y: sprite.height };
    if (forceSize)
        sp = forceSize;
    let winratio = bgSize.x / bgSize.y;
    let spratio = sp.x / sp.y;
    let scale = 1;
    let pos = new Point(0, 0);
    if (type == 'cover' ? (winratio > spratio) : (winratio < spratio)) {
        //photo is wider than background
        scale = bgSize.x / sp.x;
        pos.y = -((sp.y * scale) - bgSize.y) / 2;
    }
    else {
        //photo is taller than background
        scale = bgSize.y / sp.y;
        pos.x = -((sp.x * scale) - bgSize.x) / 2;
    }
    sprite.scale = new Point(scale, scale);
    sprite.position = pos;
    return bgContainer;
}
