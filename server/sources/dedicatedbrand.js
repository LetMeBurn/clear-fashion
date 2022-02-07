const fetch = require('node-fetch');
const cheerio = require('cheerio');

var linkBase = 'https://www.dedicatedbrand.com';

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parseLinks = data => {
  const $ = cheerio.load(data);

  return $('.mainNavigation-link-subMenu-link')
    .map((i, element) => {
      return $(element).find('a').attr('href');
    })
    .get();
}

const parse = data => {
  const $ = cheerio.load(data);

  return $('.productList-container .productList')
    .map((i, element) => {
      const name = $(element)
        .find('.productList-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const link = linkBase + $(element)
        .find('.productList-link')
        .attr('href');
      const price = parseInt(
        $(element)
          .find('.productList-price')
          .text()
      );

      return {name, price, link};
    })
    .get();
};

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

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};


module.exports.scrapeLinks = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      listLinks = parseLinks(body);
      listLinks = listLinks.filter(link => link.match(/\/men\//) !== null);   //Only men links
      //We can notice on the site that all men products can be retrieved via all-men category
      //https://www.dedicatedbrand.com/en/men/all-men#page=10 is the maximum page we can reach
      //Need to find how to access it

      return listLinks;
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
