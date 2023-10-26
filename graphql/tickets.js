const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt
} = require('graphql');

const TicketType = new GraphQLObjectType({
    name: 'Ticket',
    description: 'This represents a ticket',
    fields: () => ({
        id: { type: GraphQLInt },
        code: { type: GraphQLString },
        trainnumber: { type: GraphQLString },
        traindate: { type: GraphQLString },
    })
});

module.exports = TicketType;
