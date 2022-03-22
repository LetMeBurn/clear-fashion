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

// Options.limit (number of products displayed)
// & Options.page (page of products displayed)
// are mandatory.
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

            if (!options.page) {options.page = 1}
            if (!options.limit) {options.limit = 12}  //Here is the limit default
            if (!options.maxPrice) {options.maxPrice = 100000}

            var sorter = {}
            if (options.order == 'price') {sorter.price = 1};
            
            if (!options.brandName){
                filtered = await collection.find({price : {$lt : options.maxPrice}}).skip(options.page * options.limit).limit(options.limit).sort(sorter).toArray();;
            }
            else if (options.brandName == 'getList'){
                filtered = await collection.distinct('brand');
            }
            else{
                filtered = await collection.find({brand : options.brandName, price : {$lt : options.maxPrice}}).skip(options.page * options.limit).limit(options.limit).sort(sorter).toArray();;
            }
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
//RetrieveData({brandName: "adresse", maxPrice: 42, order: '', limit: 5});
//RetrieveData({id: '620a66f7f427af727c3858ec'})
//RetrieveData({maxPrice : 40})
//RetrieveData({})