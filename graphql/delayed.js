const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLNonNull,
} = require('graphql');

const DelayType = new GraphQLObjectType({
    name: 'Delayed',
    description: 'This represents a delayed train',
    fields: () => ({
        ActivityId: { type: GraphQLString },
        ActivityType: { type: GraphQLString },
        AdvertisedTimeAtLocation: { type: GraphQLString },
        EstimatedTimeAtLocation: { type: GraphQLString },
        AdvertisedTrainIdent: { type: GraphQLString },
        Canceled: { type: GraphQLBoolean },
        FromLocation: { type: new GraphQLList(LocationType) },
        ToLocation: { type: new GraphQLList(LocationType) },
        LocationSignature: { type: GraphQLString },
        TimeAtLocation: { type: GraphQLString },
        OperationalTrainNumber: { type: new GraphQLNonNull(GraphQLInt) },
        TrainOwner: { type: GraphQLString },
    })
});

const LocationType = new GraphQLObjectType({
    name: 'Location',
    description: 'this shows location info',
    fields: () => ({
        LocationName: { type: GraphQLString },
        Priority: { type: GraphQLInt },
        Order: { type: GraphQLInt }
    })
});

module.exports = DelayType;
