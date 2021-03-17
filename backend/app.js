const express = require('express');
const cors = require('cors');

const routes = require('./src/routes');

const mongoose = require('mongoose');
const app = express();

require('dotenv').config();

const uri = process.env.ATLAS_URI;

mongoose.connect(
  uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }
);

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3333);