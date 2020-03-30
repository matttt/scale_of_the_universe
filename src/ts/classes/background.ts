import { 
  Container,
  Sprite,
  Loader
 } from 'pixi.js';
import {background} from "../helpers/background";
import {map} from "../helpers/map";

export class Background {
  protected lightContainer: Container;
  protected darkContainer: Container;

  public bgContainer: Container;  


  constructor(w: number, h: number, loader: Loader) {
    this.bgContainer = new Container();

    const size = {x: w, y: h}

    const lightTexture = loader.resources.lightBG.texture;
    const darkTexture = loader.resources.darkBG.texture;
    
    const lightSprite = new Sprite(lightTexture);
    const darkSprite = new Sprite(darkTexture);

    this.lightContainer = background(size, lightSprite, 'cover', size);
    this.darkContainer = background(size, darkSprite, 'cover', size);

    this.bgContainer.addChild(this.lightContainer, this.darkContainer);

    this.darkContainer.alpha = 0;
    this.lightContainer.alpha = 0.6;
  }


  setColor(scaleExp: number) {

    if(scaleExp > 5) {
      let opacity = map(scaleExp, 5,7, 0.1, 1);

      this.darkContainer.alpha = opacity;
    } else {
      this.darkContainer.alpha = 0.1;
    }

  }


}