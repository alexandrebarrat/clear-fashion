const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const { MongoClient,ObjectId } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://root:root@clearfashion.spqbekg.mongodb.net/?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'ClearFashion';

const PORT = 8092;
const app = express();
module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());
app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

// Search for specific products

async function SearchProducts(filters,limite) {
  const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true });
  const db = client.db(MONGODB_DB_NAME);
  const collection = db.collection('products');
  const result = await collection.find(filters).sort({"price":1}).limit(limite).toArray();
  await client.close();
  return result;
}

app.get('/products/search', async (req, res) => {
  const brand = req.query.brand || undefined;
  const limite = req.query.limit || 12;
  const price = req.query.price || undefined;
  let filters = {}

  // Filter by brand
  if(brand!== undefined){
    filters.brand=brand; 
  }

  // Filter by price
  if (price!== undefined){
    filters.price = {$lte : parseInt(price)}; 
  }

  const products_search = await SearchProducts(filters,parseInt(limite));
  //res.json(products_search);
  res.send(products_search);
});



// Fetch a specific product
async function findProductById(IdProduct) {
  const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true });
  const db = client.db(MONGODB_DB_NAME);
  const collection = db.collection('products');
  const result = await collection.find({"_id":ObjectId(IdProduct)}).toArray();
  await client.close();
  return result;
}


app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);