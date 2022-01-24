// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
var currentProducts = [];
var currentPagination = {};

// inititiate selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select')
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

//Variables needed to be store
var currentsize = 0;
var brandsList = []
var allProducts = []
var updatedProducts = []

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
  brandsList = UniqueBrands(result);
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
        <span>${product.price}</span>
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
const renderIndicators = pagination => {
  //console.log(pagination);
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
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
  renderIndicators(pagination);
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

function GenerateNewPagination(newProductList, displaySize){
  return {'currentPage' : 1, 'pageCount' : Math.ceil(newProductList.length/displaySize), 'pageSize' : displaySize, 'count' : newProductList.length};
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
  fetchProducts(currentPagination.currentPage, currentsize)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});

selectPage.addEventListener('change', event => {
  fetchProducts(parseInt(event.target.value), currentsize)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
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
    var newPagination = GenerateNewPagination(updatedProducts, currentsize);
    var slicedNPList = updatedProducts.slice(0+newPagination.currentPage*newPagination.pageSize, newPagination.pageSize+newPagination.currentPage*newPagination.pageSize);
    console.log(newPagination);
    currentProducts = slicedNPList;
    currentPagination = newPagination;
    render(slicedNPList, newPagination);
  }
});


