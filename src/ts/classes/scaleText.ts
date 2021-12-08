import { Text, Container } from 'pixi.js-legacy';
import { map } from '../helpers/map';

export class ScaleText {
  public textSpace:Text;
  public textGround:Text;
  public baseTextSpace:Text;
  public baseTextGround:Text;
  public containerSpace:Container;
  public containerGround:Container;
  public container:Container;

  private textColor = 0x000000;
  private textColorSpace = 0xFFFFFF;

  constructor(x:number, y: number, text: string) {

    this.baseTextGround = new Text('10', {
      fontFamily: "Roboto",
      fontSize: 32,
      fill: this.textColor,
      stroke: this.textColor,
      align: "center",
    });


     this.textGround = new Text(text, {
      fontFamily: "Roboto",
      fontSize: 14,
      fill: this.textColor,
      stroke: this.textColor,
      align: "left",
    });

    this.baseTextSpace = new Text('10', {
      fontFamily: "Roboto",
      fontSize: 32,
      fill: this.textColorSpace,
      stroke: this.textColorSpace,
      align: "center",
    });

     this.textSpace = new Text(text, {
      fontFamily: "Roboto",
      fontSize: 14,
      fill: this.textColorSpace,
      stroke: this.textColorSpace,
      align: "left",
    });

    this.containerSpace = new Container();
    this.containerGround = new Container();

    this.containerSpace.addChild(this.baseTextSpace, this.textSpace)
    this.containerGround.addChild(this.baseTextGround, this.textGround)


    this.container = new Container();

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

  setText (str:string) {
    this.textSpace.text = Number(str).toFixed(1);
    this.textGround.text = Number(str).toFixed(1);
  }

  setColor(scaleExp: number) {

    if(scaleExp > 5) {
      let opacity = map(scaleExp, 5,7, 0.1, 1);

      this.containerSpace.alpha = opacity;
    } else {
      this.containerSpace.alpha = 0.1;
    }

  }
}