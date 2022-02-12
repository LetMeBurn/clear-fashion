/* eslint-disable no-console, no-process-exit */
const montlimartbrand = require('./sources/montlimartbrand');
const { HostAddress } = require('mongodb');

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
  return allProducts;
}

getAllProducts();
