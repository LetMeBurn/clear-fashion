// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
var currentProducts = [];
var currentPagination = {};

// inititiate selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const filterRPrice = document.querySelector('#Rprice');
const filterRReleased = document.querySelector('#Rreleased')
const sectionProducts = document.querySelector('#products');
const selectSorting = document.querySelector('#sort-select');

const spanNbProducts = document.querySelector('#nbProducts');
const spanNbNewProducts = document.getElementById("nbNewProducts");
const spanP50 = document.getElementById("p50");
const spanP90 = document.getElementById("p90");
const spanP95 = document.getElementById("p95");
const spanLatestRelease = document.getElementById("latestProductDate");

//Variables needed to be store
var currentsize = 0;
var brandsList = []
var allProducts = []
var unfilteredProducts = []
var updatedProducts = []
var slicedProducts = []

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};
const setAllProducts = ({result, meta}) => {
  allProducts = result;
  updatedProducts = result;
  unfilteredProducts = result;
  brandsList = UniqueBrands(result);
  renderIndicators(result, meta);
  renderBrands(brandsList);
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();
    if (size < 100){
      currentsize = size;
    }
    //Sets length to 0 if we fetch from the API
    updatedProducts = allProducts;
    unfilteredProducts = updatedProducts;

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
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
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}€</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = (products, pagination) => {
  //console.log(pagination);
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
  if (updatedProducts.length == 0) {spanNbNewProducts.textContent = filterNewReleases(allProducts).length;}
  else {spanNbNewProducts.textContent = filterNewReleases(updatedProducts).length;}
  spanP50.textContent = POperation(products, 50) + "€";
  spanP90.textContent = POperation(products, 90) + "€";
  spanP95.textContent = POperation(products, 95) + "€";
  spanLatestRelease.textContent = 0;
};

/**
 * Render list of products
 * @param  {Array} brands
 */
const renderBrands = brandsList => {
  var htmlBrands = "";
  for (let i = 0; i < brandsList.length; i++) {
    htmlBrands += `<option value="${brandsList[i]}">${brandsList[i]}</option>`
  }

  selectBrand.innerHTML = htmlBrands;
}

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  //renderIndicators(products, pagination);
  return pagination.count
};

/**
 * Declaration of Every Product Processing Functions
 */

function UniqueBrands(productList) {
  var brandNames = [];
  const special = "Any";
  brandNames.push(special);
  productList.forEach(obj => brandNames.push(obj.brand));

  return brandNames.filter(onlyUnique);
}
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function filterByBrand(brandName){
  return allProducts.filter(obj => obj.brand == brandName);
}

function filterReasonablePrices(usedList, priceMax = 50){
  return usedList.filter(obj => obj.price <= priceMax);
}

function newRelease(releaseDate, daysThreshold){
  const datediff = Math.abs(new Date() - new Date(releaseDate));
  const diffDays = Math.ceil(datediff / (1000 * 60 * 60 * 24));
  if (diffDays < 14)
    return releaseDate;
}
function filterNewReleases(usedList, daysThreshold = 14){
  return usedList.filter(obj => newRelease(obj.released, daysThreshold));
}

//Data sorters :
var priceComp = (a,b) => {return a.price - b.price}
var priceCompDesc = (a,b) => {return b.price - a.price}
var dateComp = (a,b) => {return new Date(a.released) - new Date(b.released)}
var dateCompDesc = (a,b) => {return new Date(b.released) - new Date(a.released)}

//P50,90,05 statistic generation
function POperation(products, percentile){
  const prices = products.map(obj => obj.price);
  const pricesSorted = prices.sort(priceComp);
  const Pvalue = pricesSorted[Math.round((100 - percentile) * (prices.length/100))];
  return Pvalue;
}

function GenerateNewPagination(newProductList, displaySize, displayPage){
  return {'currentPage' : displayPage, 'pageCount' : Math.ceil(newProductList.length/displaySize), 'pageSize' : displaySize, 'count' : newProductList.length};
}

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */

//Called when page has been fully created
document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => retrieveAllProducts(render(currentProducts, currentPagination)))
);

function retrieveAllProducts(maxNumber) {
  fetchProducts(1,maxNumber)
    .then(setAllProducts)
}

function brandsRetrieval(brandsList){
  brandsList = UniqueBrands(allProducts, brandsList);
}


selectShow.addEventListener('change', event => {
  currentsize = parseInt(event.target.value);
  currentPagination.currentPage = 1; //Prevent from displaying empty pages
  if (updatedProducts.length == 0){
    fetchProducts(currentPagination.currentPage, currentsize)
      .then(setCurrentProducts)
      .then(() => render(currentProducts, currentPagination));
  }
  else {
    var newPagination = GenerateNewPagination(updatedProducts, currentsize, currentPagination.currentPage);
    slicedProducts = updatedProducts.slice(0+(newPagination.currentPage-1)*newPagination.pageSize, newPagination.pageSize+(newPagination.currentPage-1)*newPagination.pageSize);
    currentProducts = slicedProducts;
    currentPagination = newPagination;
    render(slicedProducts, newPagination);
  }
});

selectPage.addEventListener('change', event => {
  if (updatedProducts.length == 0){
    fetchProducts(parseInt(event.target.value), currentsize)
      .then(setCurrentProducts)
      .then(() => render(currentProducts, currentPagination));
  }
  else{
    var newPagination = GenerateNewPagination(updatedProducts, currentsize, parseInt(event.target.value));
    slicedProducts = updatedProducts.slice(0+(newPagination.currentPage-1)*newPagination.pageSize, newPagination.pageSize+(newPagination.currentPage-1)*newPagination.pageSize);
    currentProducts = slicedProducts;
    currentPagination = newPagination;
    render(slicedProducts, newPagination);
  }
});

selectBrand.addEventListener('change', event => {
  if (event.target.value == 'Any'){
    currentPagination.currentPage = 1; //Prevent from displaying empty pages
    fetchProducts(currentPagination.currentPage, currentsize)
      .then(setCurrentProducts)
      .then(() => render(currentProducts, currentPagination));
  }
  else{
    updatedProducts = filterByBrand(event.target.value);
    unfilteredProducts = updatedProducts;
    var newPagination = GenerateNewPagination(updatedProducts, currentsize, 1);
    slicedProducts = updatedProducts.slice(0+(newPagination.currentPage-1)*newPagination.pageSize, newPagination.pageSize+(newPagination.currentPage-1)*newPagination.pageSize);
    currentProducts = slicedProducts;
    currentPagination = newPagination;
    render(slicedProducts, newPagination);
  }
});

filterRPrice.onchange = function() {
  if(filterRPrice.checked) {
    var usedList = updatedProducts;
    if (updatedProducts.length == 0){usedList = allProducts;}

    updatedProducts = filterReasonablePrices(usedList);
    var newPagination = GenerateNewPagination(updatedProducts, currentsize, 1);
    slicedProducts = updatedProducts.slice(0+(newPagination.currentPage-1)*newPagination.pageSize, newPagination.pageSize+(newPagination.currentPage-1)*newPagination.pageSize);
    currentProducts = slicedProducts;
    currentPagination = newPagination;
    render(slicedProducts, newPagination);
  } 
  else {
    ProcessFilters();
  }
};

filterRReleased.onchange = function() {
  if(filterRReleased.checked) {
    var usedList = updatedProducts;
    if (updatedProducts.length == 0){usedList = allProducts;}

    updatedProducts = filterNewReleases(usedList);
    var newPagination = GenerateNewPagination(updatedProducts, currentsize, 1);
    slicedProducts = updatedProducts.slice(0+(newPagination.currentPage-1)*newPagination.pageSize, newPagination.pageSize+(newPagination.currentPage-1)*newPagination.pageSize);
    currentProducts = slicedProducts;
    currentPagination = newPagination;
    render(slicedProducts, newPagination);
  } 
  else {
    ProcessFilters();
  }
};

function ProcessFilters(){
  updatedProducts = unfilteredProducts;
  if(filterRPrice.checked) {
    updatedProducts = filterReasonablePrices(updatedProducts);
  }
  if(filterRReleased.checked) {
    updatedProducts = filterNewReleases(updatedProducts);
  }
  var newPagination = GenerateNewPagination(updatedProducts, currentsize, 1);
  slicedProducts = updatedProducts.slice(0+(newPagination.currentPage-1)*newPagination.pageSize, newPagination.pageSize+(newPagination.currentPage-1)*newPagination.pageSize);
  currentProducts = slicedProducts;
  render(slicedProducts, newPagination);
}

selectSorting.addEventListener('change', event => {
  var usedList = updatedProducts;
  if (updatedProducts.length == 0){usedList = allProducts;}
  
  if (event.target.value == 'none'){
    updatedProducts = usedList;
  }
  else if (event.target.value == 'price-asc'){
    updatedProducts = usedList.sort(priceComp);
  }
  else if (event.target.value == 'price-desc'){
    updatedProducts = usedList.sort(priceCompDesc);
  }
  else if (event.target.value == 'date-asc'){
    updatedProducts = usedList.sort(dateComp);
  }
  else if (event.target.value == 'date-desc'){
    updatedProducts = usedList.sort(dateCompDesc);
  }

  var newPagination = GenerateNewPagination(updatedProducts, currentsize, 1);
  slicedProducts = updatedProducts.slice(0+(newPagination.currentPage-1)*newPagination.pageSize, newPagination.pageSize+(newPagination.currentPage-1)*newPagination.pageSize);
  currentProducts = slicedProducts;
  currentPagination = newPagination;
  render(slicedProducts, newPagination);
});



