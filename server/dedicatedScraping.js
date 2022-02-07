/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const montlimartbrand = require('./sources/montlimartbrand');
const adresseparisbrand = require('./sources/adresseparisbrand');
const fetch = require('node-fetch');
const { HostAddress } = require('mongodb');

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

//Finally doesn't work with #page=x, we'll need to retrieve from dedicated own API
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

//We'll need to process through the API found at address :
//https://www.dedicatedbrand.com/en/loadfilter

async function getAPI() {
    const response = await fetch(
        'https://www.dedicatedbrand.com/en/loadfilter'
    );
    const body = await response.json();

    //console.log(body.products);
    return body.products;
}

getAPI();
