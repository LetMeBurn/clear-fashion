const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const RetrieveData = require('./database');
const getDB = require('./database')

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

app.get("/products", async (request, response) => {
  const products = await RetrieveData();
  response.send(products);
});

app.get("/:id", async (request, response) => {
  const product = await RetrieveData({id: request.params.id});
  await response.send(product);
});

app.get("/products/search", async (request, response) => {
  const query = request.query;
  const options = {};
  if (query.brand) options["brandName"] = query.brand;
  if (query.price) options["maxPrice"] = parseFloat(query.price);
  if (query.order) options["order"] = query.order;
  if (query.limit) options["limit"] = parseInt(query.limit);
  console.log(options)
  const result = await RetrieveData(options);
  await response.send(result);
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
