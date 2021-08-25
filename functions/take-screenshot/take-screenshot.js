require('6cc')
const chromium = require('chrome-aws-lambda');

 var up = async x => {
         
            if (typeof fetch === 'undefined') {
        require('isomorphic-unfetch')
    }
      

            if (typeof FormData === 'undefined') {
         var FormData = require('form-data')
    }
        
        const formData = new FormData();
        formData.append("image", image.replace("data:image/jpeg;base64,", '').replace("data:image/png;base64,", ''));
        return await fetch(`https://api.imgbb.com/1/upload?key=33612f7751537f4f27c5253f56edbf16`, {
            method: "POST",
            body: formData,
        }).then(r => r.json()).then(r => [r.data.display_url, r.data.thumb.url, r.data.url_viewer.replace("https://", ""),r.data.url])
     .then(r => {
            console.warn(r)
       return r
        })
    }



exports.handler = async (event, context) => {

    const pageToScreenshot = JSON.parse(event.body).pageToScreenshot;

    if (!pageToScreenshot) return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Page URL not defined' })
    }

    const browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
    });
    
    const page = await browser.newPage();

    await page.goto(pageToScreenshot, { waitUntil: 'networkidle2' });

    const screenshot = await up(Buffer.from(await page.screenshot({ encoding: "binary", fullPage: true })).toString('base64'))
console.warn(screenshot)
    await browser.close();

    return {
        statusCode: 200,

        body: JSON.stringify({ 
            message: `Complete screenshot of ${pageToScreenshot}`, 
            buffer: screenshot 
        })
    }

}
