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

const titles = [
  'The Scale of the Universe 2',
  'סדרי גודל ביקום',
  'De schaal van het Universum',
  'The Scale of the Universe 2',
  '宇宙的刻度',
  'La Escala del Universo 2',
  'Universums Skala',
  'Rozmiar Wszechświata',
  'A Escala do Universo',
  'Die Proportionen des Universums',
  '宇宙的刻度',
  "L'échelle de l'Univers",
  'La Skalo de la Universo',
  'Scala Universului',
  'Розмір Всесвіту',
  'ﻥﻮﻜﻟﺍ ﺱﺎﻴﻘﻣ',
  '우주의 규모',
  'Universumi ulatus',
  'ابعاد جهان 2',
  'Evren Ölçeði 2'
]

const titleEl = document.getElementById("title");
const hoverTitleEl = document.getElementById("hoverTitle");
let hoverTimeout;
window['setTitle'] = (idx) => {
  if (hoverTimeout) 
    clearTimeout(hoverTimeout);

  hoverTitleEl.innerHTML = titles[idx];
  hoverTitleEl.style.display = 'block'
  titleEl.style.display = 'none';
}

window['revealTitle'] = () => {
  if (hoverTimeout) 
    clearTimeout(hoverTimeout);

  hoverTimeout = setTimeout(showTitle, 1000);
}

function showTitle () {
  titleEl.style.display = 'block';
  hoverTitleEl.style.display = 'none'
}


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

let titleCaroselTimeout;

function titleCarosel() {
  titleEl.textContent = titles[n++ % (titles.length - 1)];
  fadeIn.tween().then(
   titleCaroselTimeout = setTimeout(() => {
      fadeOut.tween().then();
    }, 2000)
  );
}

const muteToggle:any = document.getElementById('muteToggle');
muteToggle.onclick = function (ev) {
  Howler.mute(muteToggle.checked)
}

titleCarosel();
const titleCaroselInterval = setInterval(titleCarosel, 3000);

const frame = document.getElementById("frame");

const langWrapper = document.getElementById("langWrapper");
const startWrapper = document.getElementById("startWrapper");

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



// loader.add('assets1', '/img/new/item_textures_0_quarter.json')
const modal: any = document.getElementById("modal");
dialogPolyfill.registerDialog(modal);

const globalResolution = 1;

loader.load(async (loader, resources) => {
  // document.getElementById('loadingBar').style.visibility = 'hidden';
  const loadingSpin:any = document.getElementById("loadingSpin");
  loadingSpin.remove();

  modal.showModal();

  let app = new PIXI.Application({
    width: frame.offsetWidth,
    height: frame.offsetHeight,
    backgroundColor: 0xffffff,
    antialias: true,
    autoDensity: true,
    powerPreference: "high-performance",
    resolution: globalResolution
  });
  
  const w: number = app.renderer.width;
  const h: number = app.renderer.height;
  
  let slider = new Slider(app, w, h, globalResolution, onChange, onHandleClicked);
  slider.init();
  
  let universe = new Universe(0, slider, app);
  
  let scaleText = new ScaleText((w * 0.9) / globalResolution, (slider.topY - 40), "0");
  
  let background = new Background(w, h, loader);
  
  function onChange(x: number, percent: number) {
    let scaleExp = percent * 62 - 35; //range of 10^-35 to 10^27
  
    background.setColor(scaleExp);
    scaleText.setColor(scaleExp);
    scaleText.setColor(scaleExp);

    // for (const item of universe.items) {
    //   if (item.videoSrc) {
    //       const scale = (scaleExp+1)*10
    //       const bounded = 16 - Math.max(Math.min(scale, 16), 0)
    //       // console.log(bounded)
    //       item.videoSrc.update({position: bounded});
          
        
    //   }
    // }

  
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




    langWrapper.style.display = 'none';
    startWrapper.style.display = 'block';


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

    const textData = (
      await (await fetch(`data/languages/l${langIdx}.txt`)).text()
    ).split("\n");

    clearInterval(titleCaroselInterval);
    clearTimeout(titleCaroselTimeout);
    fadeIn.stop(true);
    fadeOut.stop(true);
    titleEl.innerHTML = textData[619]
    titleEl.style.opacity = '1';


    // document.getElementById('startBtn').innerHTML = textData[619]
    document.getElementById('moveSliderText').innerHTML = textData[620]
    document.getElementById('clickObjectText').innerHTML = textData[621]
    // document.getElementById('startTitle').innerHtml = textData[619]


    await universe.createItems(resources, textData);

    slider.setPercent(map(0, -35, 27, 0, 1));
    universe.prevZoom = 0;

    
    document.onkeydown = e => {
      if (e.key === 'r') {
        app.renderer.resolution = 1
      }
    }
    
    window["startSOTU"] = () => {
      
      modal.close();
      frame.style.visibility = "visible";
      

      fadeInApp.tween().then();


      frozenStar.play();
    }
  };

  
});

// let loadingBar = new ldBar("#loadingBar");

// loader.onLoad.add(() => {
//   loadingBar.set(loader.progress)
// });
