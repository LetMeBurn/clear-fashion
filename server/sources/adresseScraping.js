/* eslint-disable no-console, no-process-exit */
const adresseparisbrand = require('./adresseparisbrand');
const { HostAddress } = require('mongodb');

var allProducts = []
const mainUrl = 'https://adresse.paris/630-toute-la-collection?id_category=630&n=131';

async function adresseScrape (eshop = mainUrl) {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await adresseparisbrand.scrape(eshop);

    //console.log(products);
    return products;
  } catch (e) {
    console.error(e);
  }
}

const [,, eshop] = process.argv;

//allProducts = adresseScrape();

module.exports = adresseScrape;
