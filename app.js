var express = require("express");
var path = require("path");

  // "body-parser": "~1.15.1",
  //var bodyParser = require('body-parser');
var cookieParser = require("cookie-parser");
  //"serve-favicon": "~2.3.0"
//var favicon = require('serve-favicon');
var logger = require("morgan");

//var runkeeper = require("./Runkeeper.js");

var routes = require("./routes/index");
var rk_route = require("./routes/runkeeper");
var st_route = require("./routes/strava");

var app = express();

//app.locals.rk_client = new runkeeper.HealthGraph(rk_config);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
app.use(logger("dev"));
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);
app.use("/runkeeper", rk_route);
app.use("/strava", st_route);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.locals.pretty = true;

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: err
  });
});


module.exports = app;
