// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

console.log('🚀 This is it.');

const MY_FAVORITE_BRANDS = [{
  'name': 'Hopaal',
  'url': 'https://hopaal.com/'
}, {
  'name': 'Loom',
  'url': 'https://www.loom.fr'
}, {
  'name': 'ADRESSE',
  'url': 'https://adresse.paris/'
}];

console.table(MY_FAVORITE_BRANDS);
console.log(MY_FAVORITE_BRANDS[0]);



/**
 * 🌱
 * Let's go with a very very simple first todo
 * Keep pushing
 * 🌱
 */

// 🎯 TODO: The cheapest t-shirt
// 0. I have 3 favorite brands stored in MY_FAVORITE_BRANDS variable
// 1. Create a new variable and assign it the link of the cheapest t-shirt
// I can find on these e-shops
// 2. Log the variable





/**
 * 👕
 * Easy 😁?
 * Now we manipulate the variable `marketplace`
 * `marketplace` is a list of products from several brands e-shops
 * The variable is loaded by the file data.js
 * 👕
 */

// 🎯 TODO: Number of products
// 1. Create a variable and assign it the number of products
// 2. Log the variable
var nproducts = marketplace.length;
console.log(`${nproducts} products in this marketplace`);


// 🎯 TODO: Brands name
// 1. Create a variable and assign it the list of brands name only
// 2. Log the variable
// 3. Log how many brands we have
var brandNames = []
marketplace.forEach(obj => brandNames.push(obj.brand))

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

var uniqueBrands = brandNames.filter(onlyUnique);
console.log(uniqueBrands);

// 🎯 TODO: Sort by price
// 1. Create a function to sort the marketplace products by price
// 2. Create a variable and assign it the list of products by price from lowest to highest
// 3. Log the variable
var priceComp = (a,b) => {return parseInt(a.price) - parseInt(b.price)}

var priceOrder = marketplace.sort(priceComp);
console.log(priceOrder);

// 🎯 TODO: Sort by date
// 1. Create a function to sort the marketplace objects by products date
// 2. Create a variable and assign it the list of products by date from recent to old
// 3. Log the variable

var dateComp = (a,b) => {return new Date(a.date) - new Date(b.date)}
var dateCompDesc = (a,b) => {return new Date(b.date) - new Date(a.date)}

var dateOrder = marketplace.sort(dateComp);
console.log(dateOrder);

// 🎯 TODO: Filter a specific price range
// 1. Filter the list of products between 50€ and 100€
// 2. Log the list
function moderatePrice(a){
  return a.price > 50 && a.price < 100;
}

var moderatePrices = marketplace.filter(moderatePrice);
console.log(moderatePrices)

// 🎯 TODO: Average price
// 1. Determine the average price of the marketplace
// 2. Log the average
const averagePriceFct = arr => arr.reduce( ( a, b ) => a + b, 0 ) / arr.length;
    
const averagePrice = averagePriceFct(marketplace.map(obj => obj.price));    
console.log(`Average price : ${averagePrice}`);




/**
 * 🏎
 * We are almost done with the `marketplace` variable
 * Keep pushing
 * 🏎
 */

// 🎯 TODO: Products by brands
// 1. Create an object called `brands` to manipulate products by brand name
// The key is the brand name
// The value is the array of products
//
// Example:
// const brands = {
//   'brand-name-1': [{...}, {...}, ..., {...}],
//   'brand-name-2': [{...}, {...}, ..., {...}],
//   ....
//   'brand-name-n': [{...}, {...}, ..., {...}],
// };
//
// 2. Log the variable
// 3. Log the number of products by brands
function allButBrand(obj){
  var infoNoBrand = {}
  for (const [key, value] of Object.entries(obj)) {
    if (key != 'brand'){
      infoNoBrand[key] = value;
    }
  }
  return infoNoBrand;
}

var newMKPlace = {}
uniqueBrands.forEach(brand => newMKPlace[brand] = []);
marketplace.forEach(product => newMKPlace[product.brand].push(allButBrand(product)));
console.log(newMKPlace);

// 🎯 TODO: Sort by price for each brand
// 1. For each brand, sort the products by price, from highest to lowest
// 2. Log the sort
for (var val of Object.values(newMKPlace)) {
  val = val.sort(priceComp);
}
console.log(newMKPlace);

// 🎯 TODO: Sort by date for each brand
// 1. For each brand, sort the products by date, from old to recent
// 2. Log the sort
for (var val of Object.values(newMKPlace)) {
  val = val.sort(dateCompDesc);
}
console.log(newMKPlace);




/**
 * 💶
 * Let's talk about money now
 * Do some Maths
 * 💶
 */

// 🎯 TODO: Compute the p90 price value
// 1. Compute the p90 price value of each brand
// The p90 value (90th percentile) is the lower value expected to be exceeded in 90% of the products
function P90(prices){
  const pricesSorted = prices.sort(priceComp);
  const index10 = pricesSorted[Math.round(pricesSorted.length/10)];
  return index10;
}

var P90s = {}
for (const [key, value] of Object.entries(newMKPlace)) {
  var brandPrices = value.map(obj => obj.price);
  P90s[key] = P90(brandPrices);
}
console.log("Brands P90s : ")
console.log(P90s);




/**
 * 🧥
 * Cool for your effort.
 * It's almost done
 * Now we manipulate the variable `COTELE_PARIS`
 * `COTELE_PARIS` is a list of products from https://coteleparis.com/collections/tous-les-produits-cotele
 * 🧥
 */

const COTELE_PARIS = [
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-gris',
    price: 45,
    name: 'BASEBALL CAP - TAUPE',
    uuid: 'af07d5a4-778d-56ad-b3f5-7001bf7f2b7d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-navy',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - NAVY',
    uuid: 'd62e3055-1eb2-5c09-b865-9d0438bcf075',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-fuchsia',
    price: 110,
    name: 'VESTE - FUCHSIA',
    uuid: 'da3858a2-95e3-53da-b92c-7f3d535a753d',
    released: '2020-11-17'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-camel',
    price: 45,
    name: 'BASEBALL CAP - CAMEL',
    uuid: 'b56c6d88-749a-5b4c-b571-e5b5c6483131',
    released: '2020-10-19'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-beige',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BEIGE',
    uuid: 'f64727eb-215e-5229-b3f9-063b5354700d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-rouge-vermeil',
    price: 110,
    name: 'VESTE - ROUGE VERMEIL',
    uuid: '4370637a-9e34-5d0f-9631-04d54a838a6e',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-bordeaux',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BORDEAUX',
    uuid: '93d80d82-3fc3-55dd-a7ef-09a32053e36c',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/le-bob-dylan-gris',
    price: 45,
    name: 'BOB DYLAN - TAUPE',
    uuid: 'f48810f1-a822-5ee3-b41a-be15e9a97e3f',
    released: '2020-12-21'
  }
]

// 🎯 TODO: New released products
// // 1. Log if we have new products only (true or false)
// // A new product is a product `released` less than 2 weeks.
function newProduct(pDate){
  const datediff = Math.abs(new Date() - new Date(pDate));
  const diffDays = Math.ceil(datediff / (1000 * 60 * 60 * 24)); 
  if (diffDays < 14)
    return true;
  else
    return false;
}

function findsTrue(arr){
  for (var value of arr){
    if (value == true)
      return true;
  }
  return false;
}

var newProducts = COTELE_PARIS.map(obj => newProduct(obj.released));
var trueFound = findsTrue(newProducts);
if (trueFound){
  console.log("There's a brand-new product on the website!");
}
else{
  console.log("Nothing's changed recently in terms of products.");
}

// 🎯 TODO: Reasonable price
// // 1. Log if coteleparis is a reasonable price shop (true or false)
// // A reasonable price if all the products are less than 100€
var cotelePrices = COTELE_PARIS.map(obj => obj.price);
if (cotelePrices.some(price => price > 100)){
  console.log("This isn't a reasonable price shop.");
}
else{
  console.log("Every item in this shop has a reasonable price.");
}

// 🎯 TODO: Find a specific product
// 1. Find the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
// 2. Log the product
var specUUID = COTELE_PARIS.find(obj => obj.uuid == `b56c6d88-749a-5b4c-b571-e5b5c6483131`);
console.log(specUUID);

// 🎯 TODO: Delete a specific product
// 1. Delete the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
// 2. Log the new list of product
var updatedCOTELE = COTELE_PARIS.filter(obj => obj != specUUID);
console.log(updatedCOTELE)

// 🎯 TODO: Save the favorite product
let blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  //'name' : 'blue jacket',
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa',
  //'released': 'today'
};
updatedCOTELE.push(blueJacket);
console.log(updatedCOTELE);

// we make a copy of blueJacket to jacket
// and set a new property `favorite` to true
let jacket = blueJacket;

jacket.favorite = true;

// 1. Log `blueJacket` and `jacket` variables
console.log(`bluejacket :`);
console.log(blueJacket);
console.log(`jacket :`);
console.log(jacket);
// 2. What do you notice?
// -> Setting favorite to true on jacket has set the same on blue jacket because they are the same reference

blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};

// 3. Update `jacket` property with `favorite` to true WITHOUT changing blueJacket properties

jacket = Object.assign({}, blueJacket);
jacket.favorite = true;


/**
 * 🎬
 * The End
 * 🎬
 */

// 🎯 TODO: Save in localStorage
// 1. Save MY_FAVORITE_BRANDS in the localStorage
// 2. log the localStorage
localStorage.setItem('MY_FAVORITE_BRANDS', JSON.stringify(MY_FAVORITE_BRANDS));

var retrievedObject = localStorage.getItem('MY_FAVORITE_BRANDS');

console.log('retrievedObject: ', JSON.parse(retrievedObject));