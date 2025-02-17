/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const montlimartbrand = require('./sources/montlimartbrand');
const adresseparisbrand = require('./sources/adresseparisbrand');
const { HostAddress } = require('mongodb');

/*
async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/t-shirts') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await dedicatedbrand.scrape(eshop);

    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
*/

var allProducts = []
maxPageReached = false;
const mainUrl = 'https://www.dedicatedbrand.com/en/men/all-men';

async function dedicatedScrape (eshop = mainUrl) {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await dedicatedbrand.scrape(eshop);

    //console.log(products);
    return products;
  } catch (e) {
    console.error(e);
    maxPageReached = true;
  }
}

const [,, eshop] = process.argv;

async function getAllProducts() {
  var count = 1;                      //Second page is #page=2
  while (count < 11){
    if (count == 1){
      const products = await dedicatedScrape(mainUrl);
      allProducts.push(...products);
    }
    else{
      const urlPage = mainUrl + `#page=${count}`;
      const products = await dedicatedScrape(urlPage);
      allProducts.push(...products);
    }
    count++;
  }
  console.log(allProducts);
  process.exit(0);
}

getAllProducts();

