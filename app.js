require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const trains = require('./models/trains.js');
const delayed = require('./routes/delayed.js');
const tickets = require('./routes/tickets.js');
const ticketModel = require("./models/tickets.js");
const codes = require('./routes/codes.js');
const token = require('./routes/token.js');
const login = require('./routes/login.js');
const register = require('./routes/register.js');
const authModel = require('./models/auth.js');

const { createHandler } = require('graphql-http/lib/use/express');

// const expressPlayground = require('graphql-playground-middleware-express')
//     .default

const { GraphQLSchema } = require('graphql');

const RootQueryType = require("./graphql/root.js");
const RootMutationType = require("./graphql/mutate.js");

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});

const app = express();
const httpServer = require("http").createServer(app);

app.use(cors());
app.options('*', cors());

app.use(morgan('dev'));

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

// for developing mode
// app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

app.use("/login", login);
app.use("/register", register);
app.use("/token", token);

app.all('*', authModel.checkAPIKey);
app.all('*', authModel.checkToken);

app.use('/graphql', createHandler({
    schema: schema
}));

app.use("/delayed", delayed);
app.use("/tickets", tickets);
app.use("/codes", codes);

let allTickets = [];

io.sockets.on('connection', async function(socket) {
    allTickets = await ticketModel.getTickets();
    console.log(socket.id);
    allTickets.map((ticket) => {
        ticket.locked = false;
        console.log(ticket);

        return ticket;
    });

    socket.emit("allTickets", allTickets);

    socket.on("lockSocket", function(data) {
        allTickets.forEach((ticket) => {
            if (ticket.id === data) {
                ticket.locked = true;
            }
        });

        io.emit("allTickets", allTickets);
    });

    socket.on("changeStatus", async function(data) {
        allTickets = await ticketModel.getTickets();
        allTickets.forEach((ticket) => {
            if (ticket.id === data) {
                ticket.locked = false;
            }
        });

        io.emit("allTickets", allTickets);
    });

    // socket.on("alltrains", async function() {
    //     allTrains = await trains.fetchTrainPositions(io);

    //     io.emit("allTrains", allTrains);
    // });
});

const server = httpServer.listen(port, async () => {
    console.log(`Example app listening on port ${port}`);
});

trains.fetchTrainPositions(io);


module.exports = server;
