require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { sequelize, models } = require('./config/dbConfig.js')
const Query = require('./schema/resolvers/Query.js')
const Mutation = require('./schema/resolvers/Mutation.js')
const Author = require('./schema/resolvers/Author.js')
const Book = require('./schema/resolvers/Book.js')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const { default: BigInt } = require('apollo-type-bigint');

(async () => {
    // const { url } = await startStandaloneServer(server, {
    //     listen: {
    //         port: process.env.PORT || 4000
    //     },

    // })
    // console.log(`Server up at: ${url}`);
    const app = express()
    const PORT = process.env.PORT || 4000;

    const typeDefs = fs.readFileSync(
        path.join(__dirname, '/schema/schema.graphql'),
        'utf-8'
    )
    const resolvers = {
        BigInt: new BigInt("safe"),
        Query,
        Mutation,
        Author,
        Book
    }
    const schema = makeExecutableSchema({ typeDefs, resolvers })

    const server = new ApolloServer({
        schema,
    });


    await server.start()

    await sequelize.sync()
    console.log('Database synced successful');

    app.use('/graphql', bodyParser.json(), cors(), expressMiddleware(server, {
        context: ({ req }) => {
            return {
                sequelize,
                models,
                req
            }
        }
    }));

    app.listen(PORT, () => {
        console.log(`Server up at port: ${PORT}`);
    })
})();


/** Important note
 * Subscriptions - Tried using subscriptions but was getting some problem configuring the web socket. (error: "message": "Your subscription url is a websocket url, so your server must support graphql-ws or subscriptions-transport-ws protocol. If your server supports HTTP multipart subscriptions, change your subscription url to HTTP.")
 * Did not explore subscriptions much as the use case didn't demand using subscriptions (though I got an idea about subscriptions)
 * Using expressMiddleware instead of startStandaloneServer to provide support for subscriptions in future
 * Had difficulties in retrieving only the required fields from the database
 */