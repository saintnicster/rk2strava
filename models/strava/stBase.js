var stravaApi = require("strava-v3");

var StBase = function(access_token) {
  this.access_token = access_token;
  this.api = Object.create(stravaApi);

  this.getAthleteData = function (callback) {
    console.log(this.access_token);

    return stravaApi.athlete.get({access_token: this.access_token}, function(err, payload) {
      var newErr = {};
      if (payload.message === 'Authorization Error') {
        newErr = new Error(payload.message + " - " + access_token);
      } else {
        newErr = err;
      }

      return callback(newErr, payload);
    });
  };
};

exports.StBase = StBase;
