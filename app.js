var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var routes = require('@routes/index')
const { NotFoundHandler, ErrorHandler } = require('@middlewares/error-handler');
const { morganStream, logFormat } = require('@utils/logger')
const cors = require('cors')

var app = express();

app.use(logger(logFormat, { stream: morganStream })) // write to .log
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use((req, res, next) => {
//     const userAgent = req.headers['user-agent'];
//     // Cek apakah User-Agent sesuai dengan yang diinginkan
//     if (userAgent === 'Dart/3.1 (dart:io)') {
//       next(); // Lanjutkan ke middleware atau route berikutnya
//     } else {
//       res.status(403).send('Hanya bisa diakses dari aplikasi Poleman'); // Tolak permintaan jika User-Agent tidak sesuai
//     }
//   });

// app.use((req, res, next) => {
//     console.log(req)
//     next()
// })

app.use(express.static(path.join(__dirname, 'public')));    

const corsOptions = {
    origin: '*', // Adjust this as needed
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Explicitly handle OPTIONS preflight requests
app.options('*', cors(corsOptions));

app.use(routes);

// catch 404 and forward to error handler
app.use(NotFoundHandler)
// error handler
app.use(ErrorHandler)

module.exports = app;
