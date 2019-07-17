const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true
  },
  (err, client) => {
    if (err) {
      console.log(err);
    }
    console.log(`Database connection successful`);
  }
);
