import 'pixi.js-legacy';
import * as PIXI from 'pixi.js-legacy';
import { descriptionSplitter } from '../helpers/descriptionSplitter'
import { powToUnit } from '../helpers/powToUnit'

export function getGraphics (visualLocation, textDatum, units: string[], sizeData) {
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
      fontSize: 24, 
      ...baseStyle
    };

    const unitFriendlyStyle = { 
      fontSize: 24, 
      wordWrapWidth: 500,
      wordWrap: false,
      ...baseStyle
    };
    
    const exponentStyle = { 
      fontSize: scaleStyle.fontSize-8, 
      ...baseStyle
    };
    
    const descriptionStyle = { 
      fontSize: 32, 
      ...baseStyle
    };

    const {unitText, multiplier} = powToUnit(sizeData.exponent, units)
    
    const splitDescription = descriptionSplitter(textDatum.description);
    
    const titleText = new PIXI.Text(textDatum.title, titleStyle);
    const scaleText = new PIXI.Text(`${sizeData.coeff} x 10`, scaleStyle);
    const exponentText = new PIXI.Text(`${sizeData.exponent}`, exponentStyle);
    const meterText = new PIXI.Text(textDatum.metersPlural, scaleStyle);
    const unitFriendlyText = new PIXI.Text(`${sizeData.coeff * multiplier} ${unitText}${textDatum.metersPlural}`, unitFriendlyStyle);
    const descriptionText = new PIXI.Text('    ' + splitDescription, descriptionStyle);
    // const descriptionText = new PIXI.Text(sizeData.objectID + ' ' + splitDescription, descriptionStyle);

    titleText.x = x + margin;
    titleText.y = y + margin;
    titleText.roundPixels = true;

    scaleText.x = x + margin;
    scaleText.y = y + titleText.height - 10;
    scaleText.roundPixels = true;

    exponentText.x = x + margin + 2.5 + scaleText.width;
    exponentText.y = y + titleText.height - 15;
    exponentText.roundPixels = true;

    meterText.x = x + margin + 2.5 + scaleText.width + exponentText.width + 5;
    meterText.y = y + titleText.height - 10;
    meterText.roundPixels = true;

    unitFriendlyText.x = x + margin;
    unitFriendlyText.y = y + titleText.height + scaleText.height - 10;
    unitFriendlyText.roundPixels = true;

    descriptionText.x = x + margin;
    descriptionText.y = y + titleText.height + scaleText.height + unitFriendlyText.height;
    descriptionText.roundPixels = true;

    const descriptionContainer = new PIXI.Container();
    const graphics = new PIXI.Graphics();

    // set a fill and a line style again and draw a rectangle
    graphics.lineStyle(2, 0xaaaaaa, 1);
    graphics.beginFill(0x999999, 1);

    const totalTextHeight = titleText.height + descriptionText.height + scaleText.height + unitFriendlyText.height + 10;
    
    
    graphics.drawRoundedRect(x, y, w, totalTextHeight, 15);
    graphics.endFill();
    graphics.alpha = .9;

    
    descriptionContainer.x -= w/2;
    descriptionContainer.y -= h/2;
    
    descriptionContainer.addChild(graphics);
    // descriptionContainer.addChild(titleText, descriptionText);
    descriptionContainer.addChild(titleText, descriptionText, scaleText, exponentText, meterText, unitFriendlyText);

    // return descriptionContainer;
    return descriptionContainer;
}
