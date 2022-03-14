const mongo = require('mongodb');
const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://Myself:GettingIn@clusterclothing.ou37y.mongodb.net/test';
const MONGODB_DB_NAME = 'clearfashion';

const adresseScrape = require('./sources/adresseScraping');
const getAPI = require('./sources/dedicatedScraping');
const getAllProducts = require('./sources/montlimartScraping');

var products = []

//Needs to be done only once (rows insertion)
async function connection() {
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection("products");
    
    try {
        // Connect to the MongoDB cluster
        await client.connect();

        const docsNb = await collection.countDocuments();
        if (docsNb == 0){
            console.log("Collection's empty, data insertion from websites...")
            products.push.apply(products, await adresseScrape());
            products.push.apply(products, await getAPI());
            products.push.apply(products, await getAllProducts());
            const result = await collection.insertMany(products);
        }
        
        // Command to delete every document from collection
        //await collection.deleteMany( { } );

        

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function RetrieveData(options){
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection("products");

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        var filtered = null;

        if (options.id){
            var o_id = new mongo.ObjectID(options.id);
            filtered = await collection.findOne({_id : o_id});
        }
        else {
            if (!options.brandName) {options.brandName = null}
            if (!options.maxPrice) {options.maxPrice = 100000}
            if (!options.limit) {options.limit = 100000}

            var sorter = {}
            if (options.order == 'price') {sorter.price = 1};

            filtered = await collection.find({brand : options.brandName, price : {$lt : options.maxPrice}}).limit(options.limit).sort(sorter).toArray();;
        }

        console.log(filtered);

        return Promise.resolve(filtered)

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

module.exports = RetrieveData;

//connection();
//RetrieveData({brandName: "adresse", maxPrice: 42, priceSorting: true, limit: 2});
//RetrieveData({id: '620a66f7f427af727c3858ec'})