/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const fetch = require('node-fetch');
const { HostAddress } = require('mongodb');
const { get } = require('cheerio/lib/api/traversing');

var linkBase = 'https://www.dedicatedbrand.com/en/';

//We'll need to process through the API found at address :
//https://www.dedicatedbrand.com/en/loadfilter

allProducts = []

async function getAPI() {
    const response = await fetch(
        'https://www.dedicatedbrand.com/en/loadfilter'
    );
    const body = await response.json();

    //console.log(body.products);
    allProducts = body.products.map(product => {
        const pName = product.name;
        var pPrice = product.price;
        if (pPrice != null){
            pPrice = parseFloat(pPrice.price.replace(/\sEUR/, ''));
        }
        const pLink = linkBase + product.canonicalUri;
        return {name:pName, price:pPrice, link:pLink};
    });
    allProducts = allProducts.filter(product => {
        return product.name != null && product.price != null && product.link != null;
    })

    console.log(allProducts);
    return allProducts;
}

getAPI();
