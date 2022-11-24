var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


const http = require("http");
const httpErrorHandler = require("http-errors-express").default;
const { hideKnexErrors, notFound } = require('./middlewares/index');

var app = express();
app.use(express.json());

app.use(cookieParser())



const fuelRouter = require('./routes/fuel');
app.use('/api/fuel', fuelRouter);

const carsRouter = require('./routes/cars');
app.use('/api/cars', carsRouter);

const positionRouter = require('./routes/position');
app.use('/api/position', positionRouter);


app.get("/", (_req, res) => {
  res.redirect("https://example.com");
});


//Обработчики ошибок
const isProd = app.get("env") === "production";
app.use(hideKnexErrors);
app.use(notFound);
app.use(
    httpErrorHandler({
      formatError: (err, _req, _isExposed) => {
        return !isProd
            ? {
              result: false,
              error: {
                name: err.message,
                status: err.code,
                message: err.data,
                stack: err.stack,
              }
            }
            : {
              result: false,
              error: {
                name: err.message,
                status: err.code,
                message: err.data,
              }
            };
      },
    })
);


http.createServer(app).listen(3000, (err) => {
  if (err) throw err;
  console.log(
      "Server is running at localhost:%d in %s mode",
      3000,
      app.get("env")
  );
  console.log("Press CTRL-C to stop\n");
});


module.exports = app;
