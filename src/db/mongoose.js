const mongoose = require('mongoose');
const { mongo } = require('../../configs/configs')();

// mongoose.connect('mongodb://admin:password@127.0.0.1:27017/node-app-database?authSource=admin', {
mongoose.connect(
  `mongodb://${mongo.user}:${mongo.password}@${mongo.host}:${mongo.port}/${mongo.dbName}?authSource=admin`,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
);
