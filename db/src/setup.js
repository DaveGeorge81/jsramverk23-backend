/**
 * Setup database with some default data
 * Use with localhost database
 */
"use strict";

const functions = require('./functions.js');

const fs = require("fs");
const path = require("path");
const docs = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, "setup.json"),
    "utf8"
));

functions.resetCollection("tickets", docs)
    .catch(err => console.log(err));
