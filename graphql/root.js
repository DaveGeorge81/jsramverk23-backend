const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt
} = require('graphql');

const codesModel = require("../models/codes.js");
const delayedModel = require("../models/delayed.js");
const ticketModel = require("../models/tickets.js");

const CodeType = require("./codes.js");
const DelayType = require("./delayed.js");
const TicketType = require("./tickets.js");


const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        Code: {
            type: CodeType,
            description: 'A single code',
            args: {
                Code: { type: GraphQLString }
            },
            resolve: async function(parent, args) {
                let codesArray = await codesModel.getCodes();

                return codesArray.find(code => code.Code === args.Code);
            }
        },
        Codes: {
            type: new GraphQLList(CodeType),
            description: 'List of all codes',
            resolve: async function() {
                return await codesModel.getCodes();
            }
        },
        Delay: {
            type: DelayType,
            description: 'A single delay',
            args: {
                OperationalTrainNumber: { type: GraphQLString },
            },
            resolve: async function(parent, args) {
                let delaysArray = await delayedModel.getDelayedTrains();

                return delaysArray
                    .find(delay => delay.OperationalTrainNumber === args.OperationalTrainNumber);
            }
        },
        Delays: {
            type: new GraphQLList(DelayType),
            description: 'List of all delays',
            resolve: async function() {
                return await delayedModel.getDelayedTrains();
            }
        },
        Ticket: {
            type: TicketType,
            description: 'A single ticket',
            args: {
                id: { type: GraphQLInt },
            },
            resolve: async function(parent, args) {
                let ticketArray = await ticketModel.getTickets();

                return ticketArray.find(ticket => ticket.id === args.id);
            }
        },
        Tickets: {
            type: new GraphQLList(TicketType),
            description: 'List of all tickets',
            resolve: async function() {
                return await ticketModel.getTickets();
            }
        }
    })
});

module.exports = RootQueryType;
