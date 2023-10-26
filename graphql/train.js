const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull
} = require('graphql');

const TrainType = new GraphQLObjectType({
    name: 'Train',
    description: 'This represents a train',
    fields: () => ({
        trainnumber: { type: new GraphQLNonNull(GraphQLString) },
        position: { type: GraphQLString },
        timestamp: { type: GraphQLString },
        bearing: { type: GraphQLString },
        status: { type: GraphQLString },
        speed: { type: GraphQLString }
    })
});

module.exports = TrainType;
