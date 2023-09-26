/**
 * Setup database with some default data
 */
"use strict";

const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/trains";

const functions = require('./functions.js');

const fs = require("fs");
const path = require("path");
const docs = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, "setup.json"),
    "utf8"
));


functions.resetCollection(dsn, "tickets", docs)
    .catch(err => console.log(err));
