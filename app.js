require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const trains = require('./models/trains.js');
const delayed = require('./routes/delayed.js');
const tickets = require('./routes/tickets.js');
const codes = require('./routes/codes.js');
const token = require('./routes/token.js');
const login = require('./routes/login.js');
const register = require('./routes/register.js');
const authModel = require('./models/auth.js');

const app = express();
const httpServer = require("http").createServer(app);

app.use(cors());
app.options('*', cors());

app.use(morgan('dev'))

app.disable('x-powered-by');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const io = require("socket.io")(httpServer, {
    cors: {
        //origin: "https://www.student.bth.se",
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 1337;

app.get('/', (req, res) => {
    res.json({
        data: 'Hello World!'
    });
});

// app.use(express.json());

app.use("/login", login);
app.use("/register", register);
app.use("/token", token);

app.all('*', authModel.checkAPIKey);
app.all('*', authModel.checkToken);

app.use("/delayed", delayed);
app.use("/tickets", tickets);
app.use("/codes", codes);

const server = httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

trains.fetchTrainPositions(io);

module.exports = server;
