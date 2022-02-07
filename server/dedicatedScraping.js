/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const fetch = require('node-fetch');
const { HostAddress } = require('mongodb');

//We'll need to process through the API found at address :
//https://www.dedicatedbrand.com/en/loadfilter

allProducts = []

async function getAPI() {
    const response = await fetch(
        'https://www.dedicatedbrand.com/en/loadfilter'
    );
    const body = await response.json();

    //console.log(body.products);
    return body.products;
}

allProducts = getAPI();
