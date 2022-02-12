const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://Myself:GettingIn@clusterclothing.ou37y.mongodb.net/test';
const MONGODB_DB_NAME = 'clearfashion';

async function main() {
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db = client.db(MONGODB_DB_NAME);
    
    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Displays all available databases on server
        //await listDatabases(client);

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

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

main();