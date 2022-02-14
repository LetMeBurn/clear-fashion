const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://Myself:GettingIn@clusterclothing.ou37y.mongodb.net/test';
const MONGODB_DB_NAME = 'clearfashion';

const dedicatedScraping = require('./sources/dedicatedScraping');
const montlimartScraping = require('./sources/montlimartScraping');
const adresseScraping = require('./sources/adresseScraping');
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

        // Retrieve and displays shop with name : Coiffeur du coin
        //var docs = await FindByName(client, "Coiffeur du coin");
        //console.log(docs);

        // Adds a shop with only name = "Jean-Miguel" (was just a draft)
        //await CreateMultipleListings(client, [{"name": "Jean-Miguel"}]);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function RetrieveData(){
    
}

connection();