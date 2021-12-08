import { Text, Container } from 'pixi.js-legacy';
import { map } from '../helpers/map';

export class CreditText {
  public groundText:Text;
  public spaceText:Text;
  public container:Container;

  // containerSpace: Container;
  // containerGround: Container;

  private groundColor = 0x777777;
  private spaceColor = 0xCCCCCC;

  copy = 'Created by Cary Huang - youtube.com/carykh\nPorted to PixiJS by Matthew Martori';

  constructor(x:number, y: number) {

    this.groundText = new Text(this.copy, {
      fontFamily: "Roboto",
      fontSize: 14,
      fill: this.groundColor,
      // stroke: this.groundColor,
      align: "left",
    });
    this.spaceText = new Text(this.copy, {
      fontFamily: "Roboto",
      fontSize: 14,
      fill: this.spaceColor,
      // stroke: this.spaceColor,
      align: "left",
    });

    // this.containerGround = new Container();
    // this.containerSpace = new Container();

    // this.containerGround.addChild();
    // this.containerSpace.addChild();

    this.container = new Container();

    this.container.addChild(this.groundText, this.spaceText);
    
    this.container.x = x;
    this.container.y = y;
  }

  setColor(scaleExp: number) {

    if(scaleExp > 5) {
      let opacity = map(scaleExp, 5,7, 0.1, 1);

      this.spaceText.alpha = opacity;
    } else {
      this.spaceText.alpha = 0.1;
    }

  }

}