// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

const { options } = require("../../server/api");
const fetch = require("../../server/node-fetch");

// current products on the page
var currentProducts = [];
var currentPagination = {};

/*
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
*/
////////////////////////////////////////////////
// Brand-new variables to be needed for v3

var currentOptions = {}
////////////////////////////////////////////////



/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {options} - options to sharpen the research
 * @return {Object}
 */
 const fetchProducts = async (currentOptions) => {
    try {
  
      var stringSearch = ''
      //if response filters are asked for
      if (Object.entries(currentOptions).length !== 0){
          stringSearch += '/search?'
  
          //Used to manage &'s at the end of new options
          var firstOption = true
          for (const key in currentOptions) {
              if (user.hasOwnProperty(key)) {
                  if (firstOption) {firstOption = false;}
                  else {stringSearch += '&'}
  
                  stringSearch += `${key}=${currentOptions[key]}`
              }
          }
  
      }
  
      console.log(stringSearch)
  
      const response = await fetch(
        `https://clear-fashion-psi.vercel.app/products${stringSearch}`
      );
      const body = await response.json();
  
      if (body.success !== true) {
        console.error(body);
        return {currentProducts, currentPagination};
      }
      
      console.log(body);
      console.log(body.data);
      return body.data;

    } catch (error) {
      console.error(error);
      return {currentProducts, currentPagination};
    }
  };




