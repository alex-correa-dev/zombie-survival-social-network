const ROOT_PATH = process.cwd();
const express = require('express');
const parser = require('body-parser');
const compress = require('compression');
const app = express();

app.set('json spaces', 2);

app.use(parser.urlencoded({
  extended: true
}));
app.use(parser.json());
app.use(compress());

module.exports = app;
