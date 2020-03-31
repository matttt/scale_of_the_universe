import * as PIXI from "pixi.js";

import { Slider } from "./classes/slider";
import { Universe } from "./classes/universe";
import { ScaleText } from "./classes/scaleText";
import { Background } from "./classes/background";

import { pad } from "./helpers/pad";
import { E } from "./helpers/e";
import { map } from "./helpers/map";

import { Tweenable } from "shifty";

import { Howl, Howler } from "howler";
import { create } from "domain";

declare var ldBar: any;



const dialogPolyfill = require("dialog-polyfill");
// PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
// PIXI.settings.RESOLUTION = 2;
const staticHostingURL = "https://d1w6pmjy03071n.cloudfront.net";

const frozenStar = new Howl({
  src: [
    `${staticHostingURL}/frozen_star.webm`,
    `${staticHostingURL}/frozen_star.mp3`
  ],
  loop: true,
  volume: 0.5
});

const fadeInApp = new Tweenable();
fadeInApp.setConfig({
  from: { opacity: 0 },
  to: { opacity: 1 },
  easing: "easeOutSine",
  duration: 2500,
  step: state => (frame.style.opacity = state.opacity)
});

const titleEl = document.getElementById("title");

const titles = [
  "Scale of the Universe",
  `Scala dell'Universo`,
  `مقياس الكون`,
  `宇宙规模`,
  "La Escala del Universo",
  "De schaal van het Universum",
  `Skaal van die heelal`,
  `Мащаб на Вселената`,
  `Échelle de l'univers`,
  `우주의 규모`,
  `Evrenin Ölçeği`,
  `宇宙规模`
];

let n = 0;
const fadeOut = new Tweenable();
fadeOut.setConfig({
  from: { opacity: 1 },
  to: { opacity: 0 },
  easing: "easeInOutSine",
  duration: 500,
  step: state => (titleEl.style.opacity = state.opacity)
});

const fadeIn = new Tweenable();
fadeIn.setConfig({
  from: { opacity: 0 },
  to: { opacity: 1 },
  easing: "easeInOutSine",
  duration: 500,
  step: state => (titleEl.style.opacity = state.opacity)
});

function titleCarosel() {
  titleEl.textContent = titles[n++ % (titles.length - 1)];
  fadeIn.tween().then(
    setTimeout(() => {
      fadeOut.tween().then();
    }, 2000)
  );
}

titleCarosel();
const titleCaroselInterval = setInterval(titleCarosel, 3000);

const frame = document.getElementById("frame");

const langWrapper = document.getElementById("langWrapper");

// PIXI.WebGLRenderer.batchSize = 100
// PIXI.WebGLRenderer.batchMode = PIXI.WebGLRenderer.BATCH_SIMPLE;

const loader = new PIXI.Loader();

loader.add("darkBG", `${staticHostingURL}/dark_background.png`);
loader.add("lightBG", `${staticHostingURL}/light_background.png`);
// for (let i = 0; i <= 9; i++) {
//   const url = `img/items_sheet/item_textures-${i}.json`;
//   loader.add(url);
// }
// for (let i = 1; i <= 327; i++) {
//   const url = `img/items_imgs/${pad(i, 3)}.png`;
//   loader.add(i.toString(), url);
// }

loader.add("main1", `${staticHostingURL}/item_textures_0_v1.json`);
loader.add("main2", `${staticHostingURL}/item_textures_1_v1.json`);
loader.add("main3", `${staticHostingURL}/item_textures_2_v1.json`);

loader.add("assetsLow", `${staticHostingURL}/quarter_items-0-main.json`);

loader.add("assetsMedium", `${staticHostingURL}/half_items-0-main.json`);



// loader.add('assets1', '/img/new/item_textures_0_quarter.json')
const modal: any = document.getElementById("modal");
dialogPolyfill.registerDialog(modal);

loader.load(async (loader, resources) => {
  // document.getElementById('loadingBar').style.visibility = 'hidden';
  const loadingSpin:any = document.getElementById("loadingSpin");
  loadingSpin.style.visibility = "hidden";

  modal.showModal();

  let app = new PIXI.Application({
    width: frame.offsetWidth,
    height: frame.offsetHeight,
    backgroundColor: 0xffffff,
    antialias: true,
    autoDensity: true,
    powerPreference: "high-performance"
  });
  
  const w: number = app.renderer.width;
  const h: number = app.renderer.height;
  
  let slider = new Slider(app, w, h, onChange, onHandleClicked);
  slider.init();
  
  let universe = new Universe(0, slider, app);
  
  let scaleText = new ScaleText(w * 0.9, slider.topY - 40, "0");
  
  let background = new Background(w, h, loader);
  
  function onChange(x: number, percent: number) {
    let scaleExp = percent * 62 - 35; //range of 10^-35 to 10^27
  
    background.setColor(scaleExp);
    scaleText.setColor(scaleExp);
  
    universe.update(scaleExp);
  
    scaleText.setText(`${Math.round(scaleExp * 10) / 10}`);
  }
  
  function onHandleClicked() {
    universe.onHandleClicked();
  }


  // await universe.createItems(resources, Number(prompt('Enter language index (0-16)')))

  window["setLang"] = async (btnClass, langIdx) => {
    const btns:any = document.querySelectorAll('button.box');

    for (const button of btns) {
      if (button.classList[1] !== btnClass) {
        button.style.visibility = 'hidden';
      }
    }




    // start us at scale 0
    slider.setPercent(map(0.1, -35, 27, 0, 1));
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

    

    frame.appendChild(app.view);

    // langWrapper.style.visibility = "hidden";


    await universe.createItems(resources, langIdx, progress => {

    });

    slider.setPercent(map(0, -35, 27, 0, 1));
    universe.prevZoom = 0;

    frame.style.visibility = "visible";
    modal.close();

    fadeInApp.tween().then();

    clearInterval(titleCaroselInterval);

    frozenStar.play();
  };

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

// let loadingBar = new ldBar("#loadingBar");

// loader.onLoad.add(() => {
//   loadingBar.set(loader.progress)
// });
