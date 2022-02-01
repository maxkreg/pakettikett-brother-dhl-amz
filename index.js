const puppeteer = require('puppeteer');

const fs = require('fs');
const https = require('https');


(async () => {

//init
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

//open website
await page.goto('https://paketikett.de');

//select label type
await page.select('#dienstleister', 'DHL_amz_retour');

//upload asset
  const elementHandle = await page.$("input[name=dateiupload]");
  await elementHandle.uploadFile('ShipperLabel.gif');
  await page.click('button'); 

//download jpgs
await page.waitForTimeout(2000);
const imgUrl = await page.$eval('.w3-border, .w3-border-blue', img => img.src);
        
        https.get(imgUrl, res => {
            const stream = fs.createWriteStream('output.jpg');
            res.pipe(stream);
            stream.on('finish', () => {
                stream.close();
            })
        })




//print
//init
const page2 = await browser.newPage();

//open website
await page2.goto('http://100.122.136.54:8013/labeldesigner');


//upload asset
await page2.click("button[id=deleteButton]");
await page.waitForTimeout(4000);
const elementHandle2 = await page2.$("input[name=upload]");
await page.waitForTimeout(4000);
await elementHandle2.uploadFile('output.jpg');
await page.waitForTimeout(4000);
await page2.click("input[name=submit]"); 
await page.waitForTimeout(4000);
//await page2.click("button[id=printButton]"); 
await page.waitForTimeout(4000);
await page2.click("button[id=deleteButton]"); 




//end
//await browser.close();
})


();