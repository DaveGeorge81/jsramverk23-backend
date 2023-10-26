const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
} = require('graphql');


const ticketModel = require("../models/tickets.js");

const TicketType = require("./tickets.js");

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addTicket: {
            type: TicketType,
            description: 'Add ticket',
            args: {
                id: { type: GraphQLInt },
                code: { type: GraphQLString },
                trainnumber: { type: GraphQLString },
                traindate: { type: GraphQLString },
            },
            resolve: async function(parent, args) {
                let newTicket = {
                    id: args.id,
                    code: args.code,
                    trainnumber: args.trainnumber,
                    traindate: args.traindate
                };

                return await ticketModel.createTicket(newTicket);
            }
        },
        updateTicket: {
            type: TicketType,
            description: 'Update ticket',
            args: {
                id: { type: GraphQLInt },
                code: { type: GraphQLString },
                trainnumber: { type: GraphQLString },
                traindate: { type: GraphQLString },
            },
            resolve: async function(parent, args) {
                let updatedTicket = {
                    id: args.id,
                    code: args.code,
                    trainnumber: args.trainnumber,
                    traindate: args.traindate
                };

                return await ticketModel.updateTicket(updatedTicket);
            }
        },
    })
});

module.exports = RootMutationType;
