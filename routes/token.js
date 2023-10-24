const express = require('express');
const router = express.Router();

const auth = require("../models/auth.js");

router.get('/', (req, res) => auth.createToken(req, res));

module.exports = router;
