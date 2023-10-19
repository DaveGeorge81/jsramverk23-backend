require('dotenv').config();

const express = require('express');
const cors = require('cors');
// const morgan = require('morgan');
const bodyParser = require('body-parser');

const trains = require('./models/trains.js');
const delayed = require('./routes/delayed.js');
const tickets = require('./routes/tickets.js');
const codes = require('./routes/codes.js');

const { createHandler } = require('graphql-http/lib/use/express');

// const expressPlayground = require('graphql-playground-middleware-express')
//     .default

const { GraphQLSchema } = require('graphql')

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

app.use('/graphql', createHandler({
    schema: schema
}))

// for developing mode
// app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

app.use("/delayed", delayed);
app.use("/tickets", tickets);
app.use("/codes", codes);

const server = httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

trains.fetchTrainPositions(io);

module.exports = server;
