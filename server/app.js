const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const mysql = require('./services/mysql');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', express.static(path.join(__dirname, 'client')));
app.use('/api/v1/login', require('./routes/login'));
app.use(require('./middlewares/jwt'));
app.use('/api/v1/pelanggan', require('./routes/pelanggan'));
app.use('/api/v1/karyawan', require('./routes/karyawan'));
app.use('/api/v1/kategori', require('./routes/kategori'));
app.use('/api/v1/nota', require('./routes/nota'));

module.exports = app;
