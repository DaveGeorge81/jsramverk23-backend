const database = require('../db/database.js');
const functions = require('../db/src/functions.js');

const tickets = {
    getTickets: async function getTickets(req, res=undefined) {
        let db;

        try {
            db = await database.getDb();
            const resultSet = await functions.findInCollection("tickets", {}, {}, 0);

            if (res === undefined) {
                return resultSet;
            }
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

    createTicket: async function createTicket(req, res=undefined) {
        let db = await database.getDb();

        const doc = {
            id: req.id,
            code: req.code,
            trainnumber: req.trainnumber,
            traindate: req.traindate,
        };

        await db.collection.insertOne(doc);
        await db.client.close();

        if (res === undefined) {
            return doc;
        }
        return res.json({
            data: {
                id: req.body.id,
                code: req.body.code,
                trainnumber: req.body.trainnumber,
                traindate: req.body.traindate,
            }
        });
    },

    updateTicket: async function updateTicket(req, res=undefined) {
        let db = await database.getDb();

        const doc = {
            id: req.id,
            code: req.code,
            trainnumber: req.trainnumber,
            traindate: req.traindate,
        };

        const today = new Date();

        await db.collection.updateOne(
            { "id": req.id },
            { $set: {"code": req.code, "traindate": today.toISOString().substring(0, 10)}});
        await db.client.close();

        if (res === undefined) {
            return doc;
        }
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
