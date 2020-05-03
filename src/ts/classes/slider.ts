import { 
  Graphics, 
  Application, 
  Container, 
  Point  
} from "pixi.js-legacy";
import { map } from "../helpers/map";
import { E } from "../helpers/e";
import { Tweenable } from 'shifty';
import { start } from "repl";

const Stats = require( 'stats-js');

const WIDTH_PERCENT = 0.9;
const HEIGHT_PERCENT = 0.05;
const BOTTOM_MARGIN = 100;
const HANDLE_WIDTH_PERCENT = 0.04;
const BORDER_RADIUS = 15;
const SCROLL_SPEED = -1.5; 
let MAX_SCROLL_SPEED = 3; // TODO: FIX: this is modified in runtime to speed up the onclick animation
let EASING_CONSTANT = 0.005;

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);


// slider should go from -35 to 27

export class Slider {
  private app: Application;
  public container: Container;
  private handleGfx: Graphics;
  private onChange: Function;
  private onHandleClicked: Function;
  public dragging: Boolean = false;
 
  private margin: number;
  private targetX: number; 
  private currentX: number;
  private currentPercent: number;
  private animating: boolean = false; 
  public topY: number;
  private w: number;
  private h: number;
  public handleW: number;
  private tweenable: Tweenable;

  private startOffset: number = 0;


  public widthPixels: number;
  public handleWidthPixels: number;
  public scaleWidthPixels: number;

  constructor(app: Application, 
              w: number, 
              h: number, 
              globalRes: number,
              onChange: Function, 
              onHandleClicked: Function) {
    this.app = app;
    this.onChange = onChange;
    this.onHandleClicked = onHandleClicked;
    this.w = w / globalRes;
    this.h = h / globalRes;
    // this.w = w;
    // this.h = h;

    this.tweenable = new Tweenable();

    // this.tweenable.setScheduleFunction((cb) => this.app.ticker.add(() => cb()))

    this.container = new Container();

    this.widthPixels = this.w * WIDTH_PERCENT;
    this.handleWidthPixels = this.w * HANDLE_WIDTH_PERCENT;
    this.scaleWidthPixels = this.widthPixels - this.handleWidthPixels;

    // const oppWidth = ((this.w * (1 - WIDTH_PERCENT)) / 2);
    this.margin = (this.w - this.widthPixels) / 2; // left/right margin for slider bg


    document.addEventListener("mousewheel", (e: any) => {
      var e = window.event || e; // old IE support
      var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
      this.startOffset = 0;

      this.moveTarget(delta * SCROLL_SPEED)
    }, false);
  }

  init() {
    let background = this.backGround();
    let handle = this.handle();

    this.container.addChild(background, handle)

    return this.container;
  }


  backGround() {
    const graphics = new Graphics();

    // set a fill and a line style again and draw a rectangle
    graphics.lineStyle(2, 0xaaaaaa, 0);
    graphics.beginFill(0xffffff, 1);

    // graphics.drawRect(0, this.h*.9, this.w, this.h*.1);


    // set a fill and a line style again and draw a rectangle
    graphics.lineStyle(2, 0xaaaaaa, 1);
    graphics.beginFill(0x666666, .5);

    const w = this.widthPixels;
    const h = this.h * HEIGHT_PERCENT;

    const x = this.margin;
    const y = this.h - h - BOTTOM_MARGIN;

    this.topY = y;

    graphics.drawRoundedRect(x, y, w, h, h / 2);

    //ad 
    graphics.beginFill(0xFFFFFF);

    graphics.drawRect((this.w/2) - (728 / 2), y + (this.h * HEIGHT_PERCENT) + 5, 728, 90);

    graphics.endFill();
    
    const widthPixels = this.w;
    const handleWidthPixels = this.w * HANDLE_WIDTH_PERCENT;
    
    const scaleWidthPixels = widthPixels - handleWidthPixels / 2;
    
    graphics.lineStyle(3, 0x00ff00, 1);
    // graphics.drawRect(x, y, w, h);
    
    // blue rectangle
    graphics.lineStyle(3, 0x0000ff, 1);
    graphics.cacheAsBitmap = true;
    // graphics.drawRect(x + handleWidthPixels/2, y - 25, scaleWidthPixels, 5);

    return graphics;
  }

  handle() {
    var graphics = new Graphics();
    graphics.interactive = true;
    // set a fill and a line style again and draw a rectangle
    graphics.lineStyle(0, 0xaaaaaa, 0);
    graphics.beginFill(0xffffff, 1);

    const w = this.w * HANDLE_WIDTH_PERCENT;
    this.handleW = w;
    const h = this.h * HEIGHT_PERCENT;

    const x = this.w / 2 + w / 2;
    this.currentX = x;
    this.targetX = x;
    const y = this.h - h - BOTTOM_MARGIN;

    graphics.drawRoundedRect(0, 0, w, h, h / 2);

    graphics.lineStyle(3, 0xff0000, 1);
    graphics.endFill();

    // graphics.drawRect(0, 0, w, h);


    graphics.lineStyle(3, 0xff00ff, 1);
    
    // graphics.drawRect(w/2, -25, 3, 25);
    // graphics.anchor.set()

    graphics.position = new Point(x, y);
    graphics.cacheAsBitmap = true;

    // setup events
    graphics
      .on("mousedown", onDragStart)
      .on("touchstart", onDragStart)
      .on("mouseup", onDragEnd)
      .on("mouseupoutside", onDragEnd)
      .on("touchend", onDragEnd)
      .on("touchendoutside", onDragEnd)
      .on("mousemove", onDragMove)
      .on("touchmove", onDragMove);

    let here = this;

    function onDragStart(event: any) {
      this.startOffset = event.data.global.x - here.handleGfx.position.x
      
      this.data = event.data;
      this.alpha = 0.75;
      this.dragging = true;


      here.onHandleClicked();

      here.dragging = true;
    }

    function onDragEnd() {
      this.alpha = 1;

      this.dragging = false;
      here.dragging = false;

      let diff = here.currentX - here.targetX;
      let dir = diff/Math.abs(diff);

      let newDiff = diff / 3;

      if (Math.abs(diff) > (here.w / 10)) {
        here.setTarget(here.currentX - newDiff)
      }

      // set the interaction data to null
      this.data = null;
    }

    let width = this.w;
    let that = this;
    function onDragMove() {
      if (this.dragging) {
        var newX = this.data.getLocalPosition(this.parent).x;

        that.setTarget(newX - this.startOffset);
      }
    }

    this.handleGfx = graphics;
    this.handleAnim();

    return graphics;
  }



  setTarget(x: number) {
    if (x < 0) {
      x = 0;
    }
    this.targetX = x;
  }

  setTargetPercent(percent: number) {
    // HACK: changes constants to speed up the animations

    if (percent < 0) {
      percent = 0;
    }

    MAX_SCROLL_SPEED = 9;
    EASING_CONSTANT = 0.1;

    
  }

 
  setAnimationTargetPercent(targetPercent: number) {
    this.animating = true;
    console.log()
    const deltaPercent = Math.abs(this.currentPercent - targetPercent);
    const duration = Math.max(50000 * deltaPercent, 250)

    
    this.tweenable.setConfig({
      from: { pos: this.currentPercent  },
      to: { pos: targetPercent },
      easing: 'easeInOutSine',
      duration,
      step: state => this.setPercent(state.pos)
    });

    this.tweenable.tween().then(() => this.animating = false);
  }

  animStopped() {
    EASING_CONSTANT = .025;
    MAX_SCROLL_SPEED = 3;
  }

  setPercent(percent: number) {
    if (percent < 0) {
      percent = 0;
    }

    this.currentX = this.scaleWidthPixels * percent + this.margin;
    this.targetX = this.scaleWidthPixels * percent + this.margin;
    this.handleGfx.position.x = this.currentX;

    this.onChange(0, percent);
  }

  moveTarget(x: number) {

    if (this.targetX + x > 0) {
      this.targetX += x;
    }
  }

  handleAnim() {

    let frameCount = 0;
    let prevDX = 0;
    this.app.ticker.add((deltaTime: number) => {
      if (!this.animating) {
              stats.end()
              stats.begin()
              // difference between current pos and targetX pos
              
              let dX = (this.targetX - this.currentX) * deltaTime; //
              const widthPixels = this.w * WIDTH_PERCENT;
              const handleWidthPixels = this.w * HANDLE_WIDTH_PERCENT;
              const scaleWidthPixels = widthPixels - handleWidthPixels;
        
              // const oppWidth = ((this.w * (1 - WIDTH_PERCENT)) / 2);
              const margin = (this.w - widthPixels) / 2; // left/right margin for slider bg
        
              const leftBound = margin + handleWidthPixels / 2; // allow slider to get to left most edge
              const rightBound = margin + widthPixels - handleWidthPixels / 2; // ^^ but right edge
        
        
              let dXScaled = dX * EASING_CONSTANT;
              const dir = dXScaled / Math.abs(dXScaled);
        
        
              if (Math.abs(dXScaled) > MAX_SCROLL_SPEED) {
                dXScaled = MAX_SCROLL_SPEED * dir
              }
              
        
              const newX = this.currentX + dXScaled;
              const adjX = newX + handleWidthPixels / 2;
        
              const insideLeft = leftBound < adjX;
              const insideRight = adjX < rightBound;
        
              let changed = Math.abs(dXScaled) > .001;
              let newPosition = this.currentX;
                
              if (insideLeft && insideRight && changed) {
                newPosition = newX;
                this.currentX = newX;
              }

              if (adjX > rightBound + 5) {
                newPosition = rightBound - 1 - handleWidthPixels / 2;
                this.currentX =  rightBound -1 - handleWidthPixels / 2;
              }
              
        
        
              this.handleGfx.position.x = newPosition;
        
              
              let percent = (newPosition - margin) / (scaleWidthPixels);
        
              percent = Math.floor(percent * E(7)) / E(7)

              this.currentPercent = percent;
              // console.log(newPosition, percent, 'adjx:', adjX, 'rightBound', rightBound, insideRight)
        
              if (changed) {
                this.onChange(newPosition, percent);
              } else  {
                // this.app.stop();
                this.animStopped() 
              }
        
              prevDX = dXScaled; //
            
      }
    });
  }
}
