var fs = require("fs");
var runkeeper = require("../../api/Runkeeper.js");
//var util = require("util");

var rk_config = JSON.parse(fs.readFileSync("data/rk_config", {encoding: "utf-8"}));

var RkBase = function(access_token) {
  var localConfig = Object.create(rk_config);
  localConfig.access_token = access_token;

  this.isAuthenticated =
    function(callback) {
      this.user(
        function(error, response) {
          var authResponse = false;

          if ((error === null || error === {}) && typeof response.userID !== "undefined") {
            authResponse = true;
          }

          return callback(authResponse);
        }
      );
    };

  return Object.assign(new runkeeper.HealthGraph(localConfig), this);
};

 exports.RkBase = RkBase;
