require('dotenv').config();
require('./db');

const express = require('express');
const chalk = require('chalk');
const grapqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const Event = require('./models/Event.model');

const PORT = process.env.PORT || 3000;
const app = express();

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
        return Event.find()
          .then((events) => {
            console.log(events);
            return events.map((event) => {
              return { ...event._doc };
            });
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      createEvent: (args) => {
        const { eventInput } = args;
        const event = new Event({
          title: eventInput.title,
          description: eventInput.description,
          price: +eventInput.price,
          date: new Date(eventInput.date)
        });
        return event
          .save()
          .then((result) => {
            console.log(result);
            return { ...result._doc };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      }
    },
    graphiql: true
  })
);

app.listen(PORT, () => {
  console.log(`Webserver started on port ${chalk.inverse.green.bold(PORT)}`);
});
