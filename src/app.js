require('dotenv-flow').config();
require('./db/mongoose');
const express = require('express');
const taskRouter = require('./routers/vacancy');
const userRouter = require('./routers/user');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
