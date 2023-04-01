const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://root:root@clearfashion.spqbekg.mongodb.net/?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'ClearFashion';

// function that ables to add the data products on my cluster in mongodb inside a collection
async function ClientConnect() {
  const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true });
  const db = client.db(MONGODB_DB_NAME);
  const products = require("./all_products.json");
  const collection = db.collection('products');
  const result = await collection.insertMany(products);
  console.log(result);
  await client.close(); 
}


// Find all products related to a given brands
async function Product_Brand(brand) {
    const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true });
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection('products');
    const products_brand = await collection.find({brand}).toArray();
    console.log("Products related to the brand " + brand);
    console.log(products_brand);  
    await client.close();
}


//  Find all products less than a price
async function Products_Less_Price(price) {
    const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true });
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection('products');
    const products_less = await collection.find({"price":{$lt:price}}).toArray();
    console.log("Product with a price under " + price)
    console.log(products_less);  
    await client.close();
}


// Find all products sorted by price
async function Products_Sorted_Price(sorting_order) {
    const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true });
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection('products');   
    const products_price_sorted = await collection.aggregate([{$sort : {"price":sorting_order}}]).toArray(); 
    console.log("Products sorted by price in order : "+ sorting_order + " (ascending : 1, descending : -1)"); 
    console.log(products_price_sorted);  
    await client.close();
}


// Find all products sorted by date (-1 most recent at first and 1 for oldest at first)
async function Products_Sorted_Date(sorting_order) {
  const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true });
  const db = client.db(MONGODB_DB_NAME);
  const collection = db.collection('products');
  const products_date_sorted = await collection.aggregate([{$sort : {"date":sorting_order}}]).toArray();  
  console.log("Products sorted by date in order : "+ sorting_order + " (ascending (oldest first):1, descending (recent first):-1)"); 
  console.log(products_date_sorted);  
  await client.close();
}


// Find all products scraped less than 2 weeks
async function Products_Scraped_Less_Than_2_Weeks_Ago() {
  const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true });
  const db = client.db(MONGODB_DB_NAME);
  const collection = db.collection('products');
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
  //console.log(twoWeeksAgo);
  const products = await collection.find({"date":{$gt:twoWeeksAgo}}).toArray();
  console.log("Products scraped less than two weeks ago");
  console.log(products);
  await client.close();
}


function main()
{
  ClientConnect();
  Product_Brand("dedicated");
  Products_Less_Price(39);
  Products_Sorted_Price(-1);
  Products_Sorted_Date(1);
  Products_Scraped_Less_Than_2_Weeks_Ago();
}
main()