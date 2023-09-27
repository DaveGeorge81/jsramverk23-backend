/**
 * Functions for searching and resetting database
 */
"use strict";

const database = require('../database.js');

/**
 * Reset a collection by removing existing content and insert a default
 * set of documents.
 *
 * @async
 *
 * @param {string} colName Name of collection.
 * @param {string} doc     Documents to be inserted into collection.
 *
 * @throws Error when database operation fails.
 *
 * @return {Promise<void>} Void
 */
async function resetCollection(colName, doc) {
    const db = await database.getDb();
    const col = db.db.collection(colName);

    await col.deleteMany();
    await col.insertMany(doc);

    await db.client.close();
}

/**
 * Find documents in an collection by matching search criteria.
 *
 * @async
 *
 * @param {string} colName    Name of collection.
 * @param {object} criteria   Search criteria.
 * @param {object} projection What to project in results.
 * @param {number} limit      Limit the number of documents to retrieve.
 *
 * @throws Error when database operation fails.
 *
 * @return {Promise<array>} The resultset as an array.
 */
async function findInCollection(colName, criteria, projection, limit) {
    const db = await database.getDb();

    const col = db.db.collection(colName);
    const res = await col.find(criteria, projection).limit(limit).toArray();

    await db.client.close();

    return res;
}

exports.findInCollection = findInCollection;
exports.resetCollection = resetCollection;
