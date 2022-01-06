const express = require('express');
require('express-async-errors');
const {engine} = require('express-handlebars');
const methodOverride = require('method-override');
const {giftRouter} = require("./routers/gift");
const {childRouter} = require("./routers/child");
const {homeRouter} = require("./routers/home");
const {handleError} = require("./utils/errors");
require('./utils/db');
const {handlebarsHelpers} = require("./utils/handlebarsHelpers");

const app = express();

app.use(methodOverride('_method'));
app.use(express.urlencoded({
  extended: true,
}));
app.use(express.static('public'));
// app.use(express.json());
app.engine('.hbs', engine({
  extname: '.hbs',
  helpers: handlebarsHelpers,
}));
app.set('view engine', '.hbs');
app.use('/', homeRouter);
app.use('/child', childRouter);
app.use('/gift', giftRouter);

app.use(handleError);


app.listen(3000, 'localhost', () => console.log('App listening on port 3000'));

