const express = require('express');
const apiRouter = require('./router');
const timeout = require('../middlewares/timeout');
const notFound = require('../middlewares/not-found');
const errorHandler = require('../middlewares/error-handler');
const { api } = require('../../config/env');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(timeout);
app.use(apiRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(api.port, api.host, () => {
  console.log(`Server running at http://${api.host}:${api.port}`);
});

module.exports = app;
