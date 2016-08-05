var stravaApi = require("strava-v3");

var StBase = function(access_token) {
  this.access_token = access_token;
  this.api = stravaApi;

  this.getAthleteData = function (callback) {
    return stravaApi.athlete.get({}, function(err, payload) {
      return callback(err, payload);
    });
  };
};
exports.StBase = StBase;
