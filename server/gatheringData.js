const adresseScrape = require('./sources/adresseScraping');
const getAPI = require('./sources/dedicatedScraping');
const getAllProducts = require('./sources/montlimartScraping');

var products = []

async function gather() {
    products.push.apply(products, await adresseScrape());
    console.log(products);
}

gather();