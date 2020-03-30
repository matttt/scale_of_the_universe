import * as PIXI from "pixi.js";

import { Slider } from "./classes/slider";
import { Universe } from "./classes/universe";
import { ScaleText } from "./classes/scaleText";
import { Background } from "./classes/background";

import { pad } from "./helpers/pad";
import { E } from "./helpers/e";
import { map } from "./helpers/map";

import {Howl, Howler} from 'howler';

// PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
// PIXI.settings.RESOLUTION = 2;
const staticHostingURL = 'http://scaleoftheuniverse.s3-website.us-east-2.amazonaws.com';

const frozenStar = new Howl({
  src: [`${staticHostingURL}/frozen_star.webm`, `${staticHostingURL}/frozen_star.mp3`],
  autoplay: true,
  loop: true,
  volume: 0.5
});




const frame = document.getElementById('frame');

// PIXI.WebGLRenderer.batchSize = 100
// PIXI.WebGLRenderer.batchMode = PIXI.WebGLRenderer.BATCH_SIMPLE; 

let app = new PIXI.Application({
  width: frame.offsetWidth,
  height: frame.offsetHeight,
  backgroundColor: 0xffffff,
  antialias: true,
  autoDensity: true,
  powerPreference: 'high-performance'
});

frame.appendChild(app.view);

const w: number = app.renderer.width;
const h: number = app.renderer.height;

const loader = new PIXI.Loader();

loader.add('darkBG', `${staticHostingURL}/dark_background.png`);
loader.add('lightBG', `${staticHostingURL}/light_background.png`);
// for (let i = 0; i <= 9; i++) {
//   const url = `img/items_sheet/item_textures-${i}.json`;
//   loader.add(url);
// }
// for (let i = 1; i <= 327; i++) {
//   const url = `img/items_imgs/${pad(i, 3)}.png`;
//   loader.add(i.toString(), url);
// }

loader.add('main1', `${staticHostingURL}/item_textures_0_v1.json`);
loader.add('main2', `${staticHostingURL}/item_textures_1_v1.json`);
loader.add('main3', `${staticHostingURL}/item_textures_2_v1.json`);

loader.add('assetsLow', `${staticHostingURL}/quarter_items-0-main.json`);

loader.add('assetsMedium', `${staticHostingURL}/half_items-0-main.json`);

// loader.add('assets1', '/img/new/item_textures_0_quarter.json')



loader.load(async (loader, resources) => {

  
  let slider = new Slider(app, w, h, onChange, onHandleClicked);
  slider.init();

  let universe = new Universe(0, slider, app, loader);
  await universe.createItems(resources, Number(prompt('Enter language index (0-16)')))
  // await universe.createItems(resources, 0)
  
  let scaleText = new ScaleText(w * 0.90, slider.topY - 40, "0");

  let background = new Background(w, h, loader);


  // start us at scale 0 
  slider.setPercent(map(0, -35, 27, 0, 1))
  // let maskGfx = new PIXI.Graphics();

  // maskGfx.beginFill(0xffffff)
  // maskGfx.drawRoundedRect(0, 0, w / 2, h, 50);
  // app.stage.mask = maskGfx;

  // app.stage.addChild(maskGfx);

  app.stage.addChild(
                      background.bgContainer, 
                      universe.container, 
                      universe.displayContainer, 
                      slider.container, 
                      scaleText.container
  );

  function onChange(x: number, percent: number) {
    let scaleExp = percent * 62 - 35; //range of 10^-35 to 10^27

    background.setColor(scaleExp)
    scaleText.setColor(scaleExp)

    universe.update(scaleExp);

    scaleText.setText(`${Math.round(scaleExp * 10) / 10}`);
  }

  function onHandleClicked() {
    universe.onHandleClicked();
  }

  // document.body.addEventListener("keydown", event => {
  //   if (event.keyCode === 229) {
  //     return;
  //   }

  //   if (event.keyCode === 32) {

  //     document.documentElement.requestFullscreen().then(async () => {

  //       const el = document.getElementById("frame");
  //       el.classList.remove('frameStyle');
  //       el.classList.add('fullStyle');
  //       // document.body.appendChild(app.view);

  //       while (el.firstChild) {
  //         el.removeChild(el.firstChild);
  //       }

  //       // var interval_id = window.setInterval("", 9999); // Get a reference to the last
  //       // // interval +1
  //       // for (var i = 1; i < interval_id; i++) {
  //       //   window.clearInterval(i);
  //       // }

  //       // app.renderer.destroy(true);
  //       // app.ticker.stop()

  //       // app.stage.destroy(true);

  //       let app = new PIXI.Application({
  //         width: frame.offsetWidth,
  //         height: frame.offsetHeight,
  //         backgroundColor: 0xffffff,
  //         antialias: true
  //       });

  //       frame.appendChild(app.view);


  //       const w: number = app.renderer.width;
  //       const h: number = app.renderer.height;


  //       slider = new Slider(app, w, h, onChange, onHandleClicked);
  //       slider.init()

  //       universe = new Universe(0, slider, app, loader);
  //       await universe.createItems(resources, 0)

  //       scaleText = new ScaleText(w * 0.94, slider.topY, "0");

  //       background = new Background(w, h, loader);


  //       app.stage.addChild(background.bgContainer, universe.container, slider.container, scaleText.container);
  //     }).catch(err => {
  //       alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
  //     });

  //     document.addEventListener("fullscreenerror", function (e) { console.log(e) });



  //   }
  //   // do something
  // });
});

// const prog = document.querySelector('progress');
// loader.onLoad.add(() => {
//   console.log(loader.progress)
//   prog.value = loader.progress
// });