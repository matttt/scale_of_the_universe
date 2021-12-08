import 'pixi.js-legacy';
import * as PIXI from 'pixi.js-legacy';
import { descriptionSplitter } from '../helpers/descriptionSplitter'
import { powToUnit } from '../helpers/powToUnit'

export function getGraphics (visualLocation, textDatum, extraText, units: string[], sizeData) {
    const w = 450;
    const h = 500;
    const x = visualLocation.descriptionX;
    const y = visualLocation.descriptionY;
    const margin = 20;

    
    const baseStyle = {
      fontFamily: 'Roboto',
      align: 'left', 
      fill: 0x000000, 
      wordWrapWidth: w - (margin * 2) ,
      wordWrap: true
    }
    
    const titleStyle = { 
      fontSize: 40, 
      ...baseStyle
    };
    
    const scaleStyle = { 
      ...baseStyle,
      fontSize: 32, 
      fill: 0x333333,
    };

    const unitFriendlyStyle = { 
      ...baseStyle,
      fontSize: 32, 
      wordWrapWidth: 500,
      fill: 0x333333,
      wordWrap: false,
    };
    
    const exponentStyle = { 
      ...baseStyle,
      fontSize: scaleStyle.fontSize-8, 
      fill: 0x333333
    };
    
    const descriptionStyle = { 
      ...baseStyle,
      fontSize: 32 
    };

    const friendly = powToUnit(sizeData, units, extraText)
    
    const splitDescription = descriptionSplitter(textDatum.description).replace(/",/g, '');
    
    // DEBUG MODE: object id beside description title VVVV
    // const titleText = new PIXI.Text(textDatum.title.replace(/\r?\n|\r/g, ' ') + sizeData.objectID, titleStyle);
    const titleText = new PIXI.Text(textDatum.title.replace(/\r?\n|\r/g, ''), titleStyle);
    const scaleText = new PIXI.Text(`${sizeData.coeff} x 10`, scaleStyle);
    const exponentText = new PIXI.Text(`${sizeData.exponent}`, exponentStyle);
    const meterText = new PIXI.Text(textDatum.metersPlural, scaleStyle);
    const unitFriendlyText = new PIXI.Text(friendly, unitFriendlyStyle);
    const descriptionText = new PIXI.Text('    ' + splitDescription, descriptionStyle);
    // const descriptionText = new PIXI.Text(sizeData.objectID + ' ' + splitDescription, descriptionStyle);

    titleText.x = x + margin;
    titleText.y = y + margin;
    titleText.roundPixels = true;

    // ------------------

    scaleText.x = x + margin;
    scaleText.y = y + titleText.height + unitFriendlyText.height - 5 + 35;
    scaleText.roundPixels = true;

    exponentText.x = x + margin + 2.5 + scaleText.width;
    exponentText.y = y + titleText.height + unitFriendlyText.height - 12 + 35;
    exponentText.roundPixels = true;

    meterText.x = x + margin + 2.5 + scaleText.width + exponentText.width + 5;
    meterText.y = y + titleText.height + unitFriendlyText.height - 5 + 35;
    meterText.roundPixels = true;

    // -----------------

    unitFriendlyText.x = x + margin;
    unitFriendlyText.y = y + titleText.height - 10 + 35;
    unitFriendlyText.roundPixels = true;

    descriptionText.x = x + margin;
    descriptionText.y = y + titleText.height + scaleText.height + unitFriendlyText.height + 10 + 35;
    descriptionText.roundPixels = true;

    const descriptionContainer = new PIXI.Container();
    const graphics = new PIXI.Graphics();
    const totalTextHeight = titleText.height + descriptionText.height + scaleText.height + unitFriendlyText.height + 60;
    //shadow
    graphics.beginFill(0x000000, .2);


    graphics.drawRoundedRect(x + 5, y + 5, w, totalTextHeight, 15);
    graphics.endFill();
    // set a fill and a line style again and draw a rectangle
    graphics.lineStyle(2, 0xaaaaaa, 1);
    // graphics.beginFill(0x999999, 1);
    graphics.beginFill(0xFFFFFF, 1);

    
    let widthToUse = w;

    if (unitFriendlyText.width + 30 >= widthToUse) {

      widthToUse = unitFriendlyText.width + 40
    }

    graphics.drawRoundedRect(x, y, widthToUse, totalTextHeight, 15);
    graphics.endFill();
    graphics.alpha = .9;


    
    descriptionContainer.x -= w/2;
    descriptionContainer.y -= h/2;
    
    descriptionContainer.addChild(graphics);
    descriptionContainer.addChild(titleText, 
                                  descriptionText, 
                                  scaleText, 
                                  exponentText, 
                                  meterText, 
                                  unitFriendlyText);

    return descriptionContainer;
}
