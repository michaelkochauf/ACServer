const express = require('express');
const logger = require('morgan');

// Generic application setup
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Load routes into variables
const index = require('./routes/index');
const ac = require('./routes/status');

// Routes
app.use('/status', ac);
app.use('/index', index);

/**
 *  http://localhost:3000/was/noch
 *  ---------------------^          damit überhaupt Verbindung hergestellt wird
 *                       ^--^       Präfix aus app.js
 *                          ^---    Route in routes/index.js
 * 
 */


module.exports = app;
