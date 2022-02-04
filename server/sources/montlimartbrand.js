const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.product-info')
    .map((i, element) => {
      const name = $(element)
        .find('.product-name')
        .find("a")
        .attr("title");
      const price = $(element)
        .find('.price')
        .text();

      return {name, price};
    })
    .get();
};

function priceExisting(product) {
    return product.price != '';
}

const formatting = products => {
    products = products.filter(priceExisting);
    products.forEach(product => {
        product.price = parseFloat(product.price.replace(/\s€/, '').replace(',', '.'));
    })
    return products;
}

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return formatting(parse(body));
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};