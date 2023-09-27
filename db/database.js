/**
 * Connects to database
 */

const mongo = require("mongodb").MongoClient;
const collectionName = "tickets";

const database = {
    getDb: async function getDb() {
        let dsn = process.env.DBWEBB_DSN || `mongodb://localhost:27017/trains`;

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
        }

        const client = await mongo.connect(dsn);
        const db = client.db();
        const collection = db.collection(collectionName);

        return {
            db: db,
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;
