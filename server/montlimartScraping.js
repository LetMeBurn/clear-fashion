/* eslint-disable no-console, no-process-exit */
const montlimartbrand = require('./sources/montlimartbrand');
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

allProducts = []
const mainUrl = 'https://www.montlimart.com/toute-la-collection.html';

async function montlimartScrape (eshop = mainUrl) {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await montlimartbrand.scrape(eshop);

    //console.log(products);
    return products;
  } catch (e) {
    console.error(e);
  }
}

//montlimartScrape();

const [,, eshop] = process.argv;

async function getAllProducts() {
  var count = 1;
  let maxPageReached = false;
  while (maxPageReached == false){
    if (count == 1){
      const products = await montlimartScrape(mainUrl);
      allProducts.push(...products);
    }
    else{
      const urlPage = mainUrl + `?p=${count}`;
      const products = await montlimartScrape(urlPage);
      if (products[products.length - 1].name == allProducts[allProducts.length - 1].name){
        maxPageReached = true;
      }
      allProducts.push(...products);
    }
    count++;
  }
  console.log(allProducts);
  process.exit(0);
}

getAllProducts();
