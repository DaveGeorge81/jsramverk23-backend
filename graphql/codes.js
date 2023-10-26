const {
    GraphQLObjectType,
    GraphQLString,
} = require('graphql');

const CodeType = new GraphQLObjectType({
    name: 'Code',
    description: 'This represents a code',
    fields: () => ({
        Code: { type: GraphQLString },
        Level1Description: { type: GraphQLString },
        Level2Description: { type: GraphQLString },
        Level3Description: { type: GraphQLString },
    })
});

module.exports = CodeType;
