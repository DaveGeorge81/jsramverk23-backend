const express = require('express');
const router = express.Router();

const auth = require("../models/auth.js");

router.post('/', (req, res) => auth.register(req, res));
router.get('/', (req, res) => auth.register(req, res));

module.exports = router;
