const express = require('express');
const chalk = require('chalk');
const grapqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const PORT = process.env.PORT || 3000;
const app = express();

const events = [];

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  '/graphql',
  grapqlHttp({
    schema: buildSchema(`
      
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }
      
      type RootQuery {
        events: [Event!]!
      }
      
      type RootMutation {
        createEvent(eventInput: EventInput!): Event
      }
      
      schema {
        query: RootQuery
        mutation: RootMutation
      }

    `),
    rootValue: {
      events: () => {
        return events;
      },
      createEvent: (args) => {
        const { eventInput } = args;
        const event = {
          _id: Math.random().toString(),
          title: eventInput.title,
          description: eventInput.description,
          price: +eventInput.price,
          date: eventInput.date
        };
        events.push(event);
        return event;
      }
    },
    graphiql: true
  })
);

app.listen(PORT, () => {
  console.log(`Webserver started on port ${chalk.inverse.green.bold(PORT)}`);
});
