var rkBaseWrapper = require("./rkBase.js");
var RkActivityList = function(access_token) {
  this.rkBase = new rkBaseWrapper.RkBase(access_token);

  this.activityCount =
    function(callback) {
      this.rkBase.apiCall("GET", "application/vnd.com.runkeeper.FitnessActivityFeed+json",
                          "/fitnessActivities?pageSize=1",
                          function(error, parsed) {
                            var passthrough_data = {};
                            passthrough_data = error ? NaN : parsed.size;

                            return callback(error, passthrough_data);
                          }
                        );
  };//.bind(this);

  this.activityList =
    function(pageSize, pagination, callback) {
      // https://runkeeper.com/developer/healthgraph/fitness-activities
      this.rkBase.apiCall("GET", "application/vnd.com.runkeeper.FitnessActivityFeed+json",
                          "/fitnessActivities?page=" + (pagination - 1 || 0) + "&pageSize=" + (pageSize || 40),
                          function(error, activities) {
                            callback(error, activities);
                            // if (error === null || error !== {}) {
                            //   //saveJson(all_activities, "/tmp/activity_items.txt");
                            //
                            // } else {
                            //   resp.send(error);
                            // }
                          }
                        );
    };
};

exports.RkActivityList = RkActivityList;
