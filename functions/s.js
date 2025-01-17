const chromium = require('chrome-aws-lambda')
var up = async x => {
         
            if (typeof fetch === 'undefined') {
        require('isomorphic-unfetch')
    }
      

            if (typeof FormData === 'undefined') {
         var FormData = require('form-data')
    }
        
        const formData = new FormData();
        formData.append("image", x.replace("data:image/jpeg;base64,", '').replace("data:image/png;base64,", ''));
        return await fetch(`https://api.imgbb.com/1/upload?key=7fb829a26c98621357ac61199d286330`, {
            method: "POST",
            body: formData,
        }).then(r => r.json())//.then(r => [r.data.display_url, r.data.thumb.url, r.data.url_viewer.replace("https://", ""),r.data.url])
     .then(r => {
            console.warn(r)
       return r
        })
    }



exports.handler = async (event, context) => {

    var pageToScreenshot = ""//JSON.parse(event.body).pageToScreenshot;
console.log(event)
if(event.queryStringParameters.s) pageToScreenshot = "https://" + event.queryStringParameters.s

    if (!pageToScreenshot) return {
        statusCode: 400,
        body: JSON.stringify(event)
    }

    const browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
    });
    
    const page = await browser.newPage();

    await page.goto(pageToScreenshot, { waitUntil: 'networkidle2' });

   var s = await page.screenshot({ encoding: 'binary' , fullPage: true})
var sc = Buffer.from(s).toString('base64')//await up(Buffer.from(s).toString('base64'))
 //await up(sc)     .then(r => {
         //   console.warn(r)
       
      //  })     .catch(r => {
           // console.warn(r)
       
      //  })

    await browser.close();
  
    return {
        statusCode: 200,
        
            body: sc
        })
    }

}
