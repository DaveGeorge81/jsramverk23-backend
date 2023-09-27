/**
 * Connects to database
 */

const mongo = require("mongodb").MongoClient;
const databaseName = "trains";
const collectionName = "tickets";

const database = {
    getDb: async function getDb() {
        let dsn = 'mongodb+srv://'+process.env.ATLAS_USERNAME+':'+process.env.ATLAS_PASSWORD+
        '@cluster0.twkapwr.mongodb.net/?retryWrites=true&w=majority';

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
        }

        const client = await mongo.connect(dsn);
        const db = client.db(databaseName);
        const collection = db.collection(collectionName);

        return {
            db: db,
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;
