const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
    const $ = cheerio.load(data);

    return $('#product-grid .grid__item')
        .map((i, element) => {
            const name = $(element)
                .find('.full-unstyled-link')
                .text()
                .trim()
                .replace(/\s/g, ' ')
                .split("   ")[0];
            const price = parseInt(
                $(element)
                    .find('.money')
                    .text()
                    .split("€")[1]
            );
            const image = $(element).find('.media').children("img").attr("srcset").split("?")[0];
            const link =  "https://shop.circlesportswear.com/".concat($(element).find('.full-unstyled-link').attr('href'))
            const brand = "Circle Sport";
            return {name, price, brand, link, image};
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