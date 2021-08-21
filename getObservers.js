const add = require('date-fns/add');
const getDate = require('date-fns/getDate');
const fs = require("fs");
const request = require("request-promise-native");

const INIT_DAY = 4;
const INIT_MONTH = 0;
const INIT_YEAR = 2021;
let currentDate = new Date(INIT_YEAR, INIT_MONTH, INIT_DAY);

// Creates an URL and file name from current date
const makeUrlWithPdf = () => {
    let month = currentDate.getMonth() + 1;
    let day = getDate(currentDate);

    if(month < 10) {
        month = "0" + String(month);
    }

    if(day < 10) {
        day = "0" + String(day);
    }

    return { url: "https://www.kpc-group.cz/inside/files/" + INIT_YEAR + "/" + month + "/observer_" + INIT_YEAR + "-" + month + "-" + day + ".pdf",
            pdf: "observer_2021-" + month + "-" + day + ".pdf"};
}

// download pdf from URL and creates dir based on month
async function downloadPDF(pdfURL, outputFilename) {
    let dir = new Date().getMonth() + "-observerUpdate";
    let pdfBuffer = await request.get({uri: pdfURL, encoding: null});
    console.log("Writing downloaded PDF file to " + outputFilename + "...");
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    fs.writeFileSync("./" + dir + "/" + outputFilename, pdfBuffer);
}
//iterates until current month and gets all pdfs
while(currentDate.getMonth() < 8) {
    let urls = makeUrlWithPdf();
    downloadPDF(urls.url, urls.pdf);
    currentDate = add(currentDate, {days: 7});
}   
