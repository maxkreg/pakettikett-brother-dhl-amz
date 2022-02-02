const puppeteer = require('puppeteer');

const fs = require('fs');
const https = require('https');


(async () => {

//init
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();





//conversion sequence//
//open website
await page.goto('https://paketikett.de');
console.log('opened paketikett website');

//select label type
await page.select('#dienstleister', 'DHL_amz_retour');
console.log('selected label type');

//upload asset
  const elementHandle = await page.$("input[name=dateiupload]");
  console.log('selected file upload selector');

  await elementHandle.uploadFile('/Users/Maxi/Downloads/ShipperLabel.gif');
  console.log('uploading file');
await page.click('button'); 
console.log('clicked submit button');


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
        console.log('downloaded output jpeg');
        //end conversion sequence//

//print sequence//
//init
const page2 = await browser.newPage();

//open website
await page2.goto('http://100.122.136.54:8013/labeldesigner');
console.log('opened brother web interface');


//delete old asset
await page2.click("button[id=deleteButton]");
await page.waitForTimeout(4000);
console.log('deleted old asset');

//upload asset
const elementHandle2 = await page2.$("input[name=upload]");
console.log('selected file upload selector');

await page.waitForTimeout(4000);
await elementHandle2.uploadFile('output.jpg');
console.log('uploaded file');

await page.waitForTimeout(4000);
await page2.click("input[name=submit]"); 
console.log('clicked submit button');

await page.waitForTimeout(4000);

//print asset
await page2.click("button[id=printButton]"); 
console.log('printed asset');
await page.waitForTimeout(4000);

//delete used asset
await page2.click("button[id=deleteButton]"); 
console.log('deleted used asset from brother web interface');


//end print sequence//



//end
await browser.close();
})


();