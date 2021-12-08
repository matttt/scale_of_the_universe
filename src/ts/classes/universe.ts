import { Application, Container }  from "pixi.js-legacy";
import { Item } from "./item";
import { Ring } from "./ring";
import { Entity } from "./entity";
import { E } from "../helpers/e";
import { pad } from "../helpers/pad";
import { map } from "../helpers/map";
import { getScaleText } from "../helpers/getScaleText";
import { Slider } from "./slider";

const { KawaseBlurFilter } = require('pixi-filters');

export class Universe {
  private slider: Slider;
  public app: Application;
  public container: Container;
  public displayContainer: Container;
  public selectedItem: Item;
  private screenCap: String;

  public prevZoom: number;

  public items: Array<Item> = [];
  private rings: Array<Ring> = [];

  private itemCount = 0;

  private currentZoomExp: number = 0;

  constructor(
    startingZoom: number,
    slider: Slider,
    app: Application
  ) {
    this.currentZoomExp = startingZoom;
    this.prevZoom = startingZoom;
    this.container = new Container();
    this.displayContainer = new Container();

    setTimeout(() => {
      for (let e of [...this.items, ...this.rings]) {
        e.cachePeriod = false;
      }
    }, 1000)

    this.slider = slider;
    this.app = app;

    this.container.sortableChildren = false;

    this.app.renderer.plugins.interaction.on("mousedown", (e: any) => {
      if (!e.target) {
        // if clicked outside of any items
        this.unHideItems();
      }
    });

    document.addEventListener(
      "mousewheel",
      (e: any) => {
        this.unHideItems();
      },
      false
    );

    // center the rings
    this.container.x = this.app.screen.width / 2;
    this.container.y = this.app.screen.height / 2;

    this.container.pivot.x = this.container.width / 2;
    this.container.pivot.y = this.container.height / 2;

    // center the rings for display (HACKY)
    this.displayContainer.x = this.app.screen.width / 2;
    this.displayContainer.y = this.app.screen.height / 2;

    this.displayContainer.pivot.x = this.displayContainer.width / 2;
    this.displayContainer.pivot.y = this.displayContainer.height / 2;
  }

  update(scaleExp: number) {
    const delta = this.prevZoom - scaleExp;

    for (const ring of this.rings) ring.setZoom(scaleExp, delta);
    for (const item of this.items) item.setZoom(scaleExp, delta);

    this.prevZoom = scaleExp;
  }

  onHandleClicked() {
    this.unHideItems();
  }

  public hydrateHighTextures (textures: any) {
    const is = this.items;
    const rs = this.rings;
    const es = [...is, ...rs] as Entity[];

    for (let e of es) {
      const padded = pad(e.objectID, 3)
      const texture = textures[padded + ""];


      e.createHighTexture(e.objectID, texture);
      e.setItemQuality(true);
      e.setQuality(1);

      if (e instanceof Item) {
        e.setHighSpriteEvents();
      }
    }
  }

  setQuality(isHigh: boolean) {
    for (let e of [...this.items, ...this.rings]) e.setItemQuality(isHigh);
  }

  unHideItems() {
    for (const item of this.items) {
      item.hideDescription();
      item.text.renderable = true
    }

    // this.slider.terminateAutopilot()

    this.container.filters = null;

    if (this.selectedItem) {
      this.selectedItem.text.renderable = true;
      this.displayContainer.removeChildAt(0);
      this.container.addChild(this.selectedItem.getContainer());
      this.selectedItem = undefined;
    }

    while (this.displayContainer.children[0]) {
      this.displayContainer.removeChildAt(0);
    }

    this.displayContainer.visible = false;
  }

  hideAllItemsBut(item: Item) {
    if (this.selectedItem !== item) {
      if (this.selectedItem) {
        // clear if selectedItem exists
        this.displayContainer.removeChild(this.selectedItem.getContainer());
        while (this.displayContainer.children[0]) {
          this.displayContainer.removeChildAt(0);
        }

        this.container.addChild(this.selectedItem.getContainer());  
      }

      item.showDescription();

      if (item.sizeData.objectID !== 163) {
        item.text.renderable = false
      }

      this.displayContainer.addChild(item.getContainer());

      this.selectedItem = item;
      this.selectedItem.text.visible = false;

      // TweenMax.to(this.container, 2, { pixi: { blurFilter: 15 } });
      const filter = new KawaseBlurFilter(1, 3, true);

      this.container.filters = [filter];

      this.displayContainer.visible = true;

      for (const otherItem of this.items.filter(x => x !== item)) {
        // hide all other descriptions
        otherItem.hideDescription();
        otherItem.text.renderable = true;
        // otherItem.container.alpha = .5
      }
    } else {
      this.unHideItems()
    }
  }

  itemClicked(item: Item) {
    const zoomOffset = item.visualLocation.zoomOffset || 0
    const absoluteZoom = item.scaleExp + Math.log10(item.coeff * item.realRatio);

    const percent = map(absoluteZoom + zoomOffset, -35, 27, 0, 1);

    this.hideAllItemsBut(item);

    let percentFinal = 0;
    if (window.innerHeight < 750) { // 720p
      percentFinal = percent + 0.0065;
    } else {// 1080p
      percentFinal = percent + 0.004;
    }

    this.slider.setAnimationTargetPercent(percentFinal);
    
  }

  public clearHighQualityTextures() {
    for (const item of this.items) {
      item.clearHighTexture();
    }
    for (const ring of this.rings) {
      ring.clearHighTexture();
    }
  }


  async createItems(lowTextures: any, textData: Array<string>) {

    const itemSizes = await (await fetch("data/sizes.json")).json();
    const visualLocations = await (await fetch("data/visualLocations.json")).json();

    const meterText = textData[596];
    const meterPluralText = textData[597];

    const extraText = {
      centimeter: textData[598],
      centimeters: textData[599],
      lightyear: textData[600],
      lightyears: textData[601],
      meter: meterText,
      meters: meterPluralText
    }

    const units = textData.slice(602,618);

    const onClick = (item: Item) => {
      this.itemClicked(item);
    };

    this.itemCount = itemSizes.length;

    for (let idx = 0; idx < itemSizes.length; idx++) {

      const textDatum = {
        title: "",
        description: "",
        metersPlural: meterPluralText,
        meterSingular: meterText
      };

      const sizeData = itemSizes[idx];
      const visualLocation = visualLocations[idx];

      const padded = pad(idx + 1, 3);
      const textureLow = lowTextures.assetsLow.textures[padded + "_quarter"];

      // items above 29 are all normal items
      // see src/data/readme.txt for info
      if (idx >= 29) {
        textDatum.title = textData[(idx - 29) * 2];
        textDatum.description = textData[(idx - 29) * 2 + 1];

        const item = new Item(
          sizeData,
          textureLow,
          visualLocation,
          textDatum,
          extraText,
          units,
          onClick
        );


        this.items.push(item);
        this.container.addChild(item.getContainer());
      } else if (idx < 17) {
        // below 17 are rings 17
        
        let prefix = textData[idx + 602] || "";

        textDatum.title = "1 " + prefix + meterText;
        textDatum.description = getScaleText(sizeData.exponent) + " m";

        const ring = new Ring(
          idx,
          sizeData,
          textureLow,
          visualLocation,
          textDatum,
          meterPluralText
        );
        this.rings.push(ring);
        this.container.addChild(ring.getContainer());
      } else {
        let val;
        let unitPrefix = textData[602];
        if (idx <= 26) {
          val = E(idx - 27)
            .toFixed(15)
            .replace(/\.?0+$/, "");
        } else {
          val = E(idx - 26)
            .toFixed(15)
            .replace(/\.?0+$/, "");
        }

        if (val === "100") {
          unitPrefix = textData[605];
        }

        unitPrefix = unitPrefix.substring(0, unitPrefix.length);

        textDatum.title = "";

        let yoctoVal = getScaleText(sizeData.exponent + 24);

        if (yoctoVal === '1') {
          yoctoVal = '10';
        }
        textDatum.description =
          yoctoVal +
          " " +
          textData[602].substring(0, textData[602].length) +
          textData[597] +
          " ";

        if (idx === 28) {
          let femptoVal = getScaleText(sizeData.exponent + 15);
          if (femptoVal === '1') {
            femptoVal = '100';
          }
          textDatum.description =
            femptoVal +
            " " +
            textData[605].substring(0, textData[602].length) +
            textData[597];
        }

        const ring = new Ring(
          idx,
          sizeData,
          textureLow,
          visualLocation,
          textDatum,
          meterPluralText
        );
        this.rings.push(ring);
        this.container.addChild(ring.getContainer());
      }
      
      
      

    }
  }
}
