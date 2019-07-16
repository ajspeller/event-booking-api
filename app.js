const express = require('express');
const chalk = require('chalk');
const grapqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  '/graphql',
  grapqlHttp({
    schema: buildSchema(`
      type RootQuery {
        events: [String!]!
      }
      type RootMutation {
        createEvent(name: String): String
      }
      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: () => {
        return ['Romantic Cooking', 'Sailing', 'All night coding'];
      },
      createEvent: (args) => {
        const { name: eventName } = args;
        return eventName;
      }
    },
    graphiql: true
  })
);

app.listen(PORT, () => {
  console.log(`Webserver started on port ${chalk.inverse.green.bold(PORT)}`);
});
