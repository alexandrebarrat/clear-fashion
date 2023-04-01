const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
    const $ = cheerio.load(data);


    return $('.products-list .products-list__block.products-list__block--grid')
        .map((i, element) => {
            const name = $(element)
                .find('.text-reset')
                .text()
                .trim()
                .replace(/\s/g, ' ');
            const price = parseInt(
                $(element)
                    .find('.price')
                    .text()
            );
            const brand = 'Montlimart';
            const url = $(element)
                .find('.product-miniature__thumb-link')
                .attr('href');
            const photo = $(element)
                .find('img')
                .attr('data-src');

            return {name, price, brand, url, photo};
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