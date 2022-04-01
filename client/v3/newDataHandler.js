// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
//'use strict';

//const { options } = require("../../server/api.js");
//const fetch = require('node-fetch');

// current products on the page
var currentProducts = [];
var currentPagination = {};
var brandsList = [];


// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const filterRPrice = document.querySelector('#Rprice');
const filterRReleased = document.querySelector('#Rreleased');
const filterFavorite = document.querySelector('#favorites');
const sectionProducts = document.querySelector('#products');
const selectSorting = document.querySelector('#sort-select');

const spanNbProducts = document.querySelector('#nbProducts');
const spanNbNewProducts = document.getElementById("nbNewProducts");
const spanP50 = document.getElementById("p50");
const spanP90 = document.getElementById("p90");
const spanP95 = document.getElementById("p95");
const spanLatestRelease = document.getElementById("latestProductDate");

////////////////////////////////////////////////
// Brand-new variables to be needed for v3

var currentOptions = {}
var currentCount = 0
var currentPageDisplay = 1
////////////////////////////////////////////////



/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {options} - options to sharpen the research
 * Available options : id | page = 1 | limit  = 12 | brandName | maxPrice = 100000 | order 
 * @return {Object}
 */
 const fetchProducts = async (currentOptions, firstLoad = false) => {
    try {
        
        if (firstLoad) {
            const brandsResp = await fetch(`https://clear-fashion-psi.vercel.app/brands`);
            brandsList = await brandsResp.json();
            renderBrands(brandsList);
        }
        
        var stringSearch = ''
        var countSearch = '/search?limit=100000&page=1&'
        //if response filters are asked for
        if (Object.entries(currentOptions).length !== 0){
            stringSearch += '/search?'
    
            //Used to manage &'s at the end of new options
            var firstOption = true
            for (const key in currentOptions) {
                if (currentOptions.hasOwnProperty(key)) {
                    if (firstOption) {firstOption = false;}
                    else {
                        stringSearch += '&'
                        countSearch += '&'
                    }
                    
                    stringSearch += `${key}=${currentOptions[key]}`
                    //Allows to get the number of products regarding filters
                    if (key != 'limit' && key != 'page') {countSearch += `${key}=${currentOptions[key]}`}
                }
            }
        }

        const countAPILink = `https://clear-fashion-psi.vercel.app/products${countSearch}`
        console.log(`Count link is : ${countAPILink}`)
        const responseCount = await fetch(countAPILink);
        const bodyCount = await responseCount.json();
        currentCount = Object.keys(bodyCount).length;
    
        const apiLink = `https://clear-fashion-psi.vercel.app/products${stringSearch}`
        console.log(apiLink)
    
        const response = await fetch(apiLink);
        const body = await response.json();
            
        /*
        if (body.success !== true) {
            console.error(body);
            return {currentProducts, currentPagination};
        }
        */
        
        console.log(body);
        return body;

    } catch (error) {
        console.error(error);
        return {currentProducts, currentPagination};
    }
  };


//Sets currentProducts as result param
const setCurrentProducts = (result) => {
    currentProducts = result;
};


/**
 * Render list of products
 * @param  {Array} products
 */
 const renderProducts = products => {
    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');
    const template = products
      .map(product => {
        var buttonStyle = "background-color:white; border-color:black";
        if (product.favorite){
          buttonStyle = "background-color:yellow; border-color:orange";
        }
        return `
        <div class="product" id=${product.uuid}>
          <span>${product.brand}</span>
          <a href="${product.link}">${product.name}</a>
          <span>${product.price}€</span>
          <button onClick="OnFavoriteClick(${product.uuid})" type="button" style="margin-left:15px; ${buttonStyle}}">👑</button> 
          <hr align="left" color="#cccccc" width="400px;">
        </div>
      `;
      })
      .join('');
  
    div.innerHTML = template;
    fragment.appendChild(div);
    sectionProducts.innerHTML = '<h2>Products</h2>';
    sectionProducts.appendChild(fragment);
  
    //<script src="./portfolio.js"></script> this doesn't work and script html line already in index either
  };


const renderBrands = brandsList => {
    var htmlBrands = `<option value="Any">Any</option>`;
    for (let i = 0; i < brandsList.length; i++) {
        htmlBrands += `<option value="${brandsList[i]}">${brandsList[i]}</option>`
    }

    selectBrand.innerHTML = htmlBrands;
}





////////////////////////////////////////////////////////////
// Document UI changes

//Called when page has been fully created
document.addEventListener('DOMContentLoaded', () =>
    fetchProducts({}, true)
    .then(setCurrentProducts)
    .then(() => renderProducts(currentProducts))
);

//When we define a new display products number
selectShow.addEventListener('change', event => {
    currentOptions.limit = parseInt(event.target.value);
    fetchProducts(currentOptions)
    .then(setCurrentProducts)
    .then(() => renderProducts(currentProducts))
});

//When we define another page to be seen


//When we choose a brand as a filter
selectBrand.addEventListener('change', event => {
    if (event.target.value == 'Any'){
        delete currentOptions.brand;
    }
    else{
        currentOptions.brand = event.target.value;
    }
    fetchProducts(currentOptions)
    .then(setCurrentProducts)
    .then(() => renderProducts(currentProducts))
});

//When you only want reasonable prices
filterRPrice.onchange = function() {
    if(filterRPrice.checked) {
        currentOptions.maxPrice = 70;
    }
    else {
        delete currentOptions.maxPrice;
    }
    fetchProducts(currentOptions)
    .then(setCurrentProducts)
    .then(() => renderProducts(currentProducts))
}

//When you change sorting method
selectSorting.addEventListener('change', event => {

    if (event.target.value == 'none'){
        delete currentOptions.order;
    }
    else if (event.target.value == 'price-asc'){
        currentOptions.order = "price";
    }
    else if (event.target.value == 'price-desc'){
        currentOptions.order = "pricedesc";
    }
    fetchProducts(currentOptions)
    .then(setCurrentProducts)
    .then(() => renderProducts(currentProducts))
  });

