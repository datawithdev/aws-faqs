
const fs = require('fs');
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

class Webpage {
    static async generatePDF(url, faq_file_name) {
        const iPad = devices['iPad'];
        const browser = await puppeteer.launch({ headless: true }); // Puppeteer can only generate pdf in headless mode.
        const page = await browser.newPage();
        await page.emulate(iPad);
        await page.goto(url, { waitUntil: 'networkidle2' }); // Adjust network idle as required.
        const pdfConfig = {
            path: 'output/' + faq_file_name, // Saves pdf to disk.
            format: 'A4',
            printBackground: true,
            margin: { // Word's default A4 margins
                top: '2.54cm',
                bottom: '2.54cm',
                left: '2.54cm',
                right: '2.54cm'
            }
        };
        await page.emulateMedia('screen');
        await page.addStyleTag({path: 'print_style.css'})
        // await page.evaluate((title) => {
        //        let dom = document.querySelector('main');
        //        dom.prepend = '<div class="lb-row"><h2 class="lb-txt-bold lb-txt-36"> ' + title+'</h2></div>'
        //     }, title);
        const pdf = await page.pdf(pdfConfig); // Return the pdf buffer. Useful for saving the file not to disk.

        await browser.close();

        return pdf;
    }

    static async product_name_to_filename(product_name){
      const trimmed = product_name.trim();
      const lower = trimmed.toLowerCase();
      const final_str = lower.replace(/\s/g, "_");
      // https://stackoverflow.com/questions/6507056/replace-all-whitespace-characters
      return final_str
    }
}

(async() => {
    var contents = fs.readFileSync("products_to_fetch.json");
    var jsonContent = JSON.parse(contents);
    var product_name, product_faq_url;
    for (let i = 0; i < jsonContent.length; i++) {
      let url_record = jsonContent[i]
      const faq_file_name = await  Webpage.product_name_to_filename( url_record['product_name'])
      // console.log('faq_file_name: ' + faq_file_name)
      // if(i==1){
        const buffer = await Webpage.generatePDF(url_record['product_faq_url'] ,  i+1 + '_' + faq_file_name + '.pdf');
      // }

      //console.log("product_faq_url: " + url_record['product_faq_url'] + " :name: "  + url_record['product_name'] );

    }


  //    console.log("name: " + url_record['product_name'] )
    //  console.log("url: " + url_record['product_faq_url'] )


    process.exit()
    //
    // const url = 'https://aws.amazon.com/iot-1-click/faq/?nc2=h_ql_prod_it_1clk';
    // const buffer = await Webpage.generatePDF(url, 'Amazon Sumerian Param');
})();
