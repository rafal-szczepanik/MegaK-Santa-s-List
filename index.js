const express = require("express");
const methodOverride = require("method-override");
require("express-async-errors");
const {engine} = require("express-handlebars");
require("./utils/db");
const {join} = require("path");
const {handlebarHelpers} = require("./utils/handlebar-helpers");
const {handleError} = require("./utils/error");
const {giftRouter} = require("./routers/gift");
const {childRouter} = require("./routers/child");
const {homeRouter} = require("./routers/home");


const app = express();

app.use(express.static(join(__dirname, 'public')));
app.use(express.urlencoded({
  extended: true,
}));
app.use(methodOverride('_method'));
app.engine('.hbs', engine({
  extname: '.hbs',
  helpers: handlebarHelpers
}));
app.set('view engine', '.hbs');
// app.use(express.json())
app.use('/css', express.static(join(__dirname, '/node_modules/bootstrap/dist/css')));

app.use('/', homeRouter);
app.use('/child', childRouter);
app.use('/gift', giftRouter);
app.use(handleError);


app.listen(3000, 'localhost', () => console.log('App is working on http://localhost:3000'));
