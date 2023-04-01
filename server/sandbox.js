/* eslint-disable no-console, no-process-exit */
const fs = require('fs').promises;
const dedicatedbrand = require('./eshops/dedicatedbrand');
const circlesportswear = require('./eshops/circlesportswearbrand');
const montlimart = require('./eshops/montlimartbrand');

async function scrape (eshop) {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);
    let products;

    if (eshop.includes('dedicatedbrand')) {
      products = await dedicatedbrand.scrape(eshop);
    }
    else if (eshop.includes('circlesportswearbrand')) {
      products = await circlesportswear.scrape(eshop);
    }
    else if (eshop.includes('montlimartbrand')) {
      products = await montlimart.scrape(eshop);
    }

    return products;
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function main() {
  let sitesToScrape = ['https://shop.circlesportswear.com/collections/all', 'https://www.montlimart.com/99-vetements',];

  for (page = 1; page <= 16; page++) {
    sitesToScrape.push(`https://www.dedicatedbrand.com/en/men/all-men?p=${page}`)
    sitesToScrape.push(`https://www.dedicatedbrand.com/en/women/all-women?p=${page}`)
  }
  let products = [];

  for (const site of sitesToScrape) {
    const scrapedProducts = await scrape(site);
    products = products.concat(scrapedProducts);
  }
  console.log(products);
  // Convert the products array to JSON format
  const jsonProducts = JSON.stringify(products, null, 2);

  await fs.writeFile('all_products.json', jsonProducts, 'utf8');
  console.log('File saved successfully!');
  console.log('done');
  process.exit(0);

}



main();