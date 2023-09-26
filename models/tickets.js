const database = require('../db/database.js');
const functions = require('../db/src/functions.js');

const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/trains";

const tickets = {
    getTickets: async function getTickets(req, res) {
        let db;

        try {
            db = await database.openDb();
            const resultSet = await functions.findInCollection(dsn, "tickets", {}, {}, 0);

            if (resultSet) {
                return res.json({ data: resultSet });
            }
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/",
                    title: "Database error",
                    detail: e.message
                }
            });
        } finally {
            await db.client.close();
        }
    },

    createTicket: async function createTicket(req, res) {
        let db = await database.openDb();

        const doc = {
            id: req.body.id,
            code: req.body.code,
            trainnumber: req.body.trainnumber,
            traindate: req.body.traindate,
        };

        await db.collection.insertOne(doc);
        await db.client.close();

        return res.json({
            data: {
                id: req.body.id,
                code: req.body.code,
                trainnumber: req.body.trainnumber,
                traindate: req.body.traindate,
            }
        });
    }
};

module.exports = tickets;
