var StBaseWrapper = require("./stBase.js");

var StActivityList = function(access_token) {
  var StBase = new StBaseWrapper.StBase(access_token);
  this.access_token = access_token;

  this.activityList = function(page, callback) {
    StBase.api.athlete.listActivities({access_token: this.access_token, per_page:200, page:page},
      function(err, payload) {
        if (payload.length == 200) {
          //this.activityList(function(++page, function(err, payload) { return err, payload}));
        }
        return callback(err, payload);
      }
    );
  };
};

exports.StActivityList = StActivityList;
