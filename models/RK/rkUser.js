//var fs = require('fs');
var rkBaseWrapper = require("./rkBase.js");

var RkUser = function(token) {
  this.rkBase = new rkBaseWrapper.RkBase(token);
  this.userData = {
    user: null,
    profile: null,
    settings: null
  };
  this.getSettings =
    function(callback) {
      if (this.userData.settings !== null) {
        return callback(null, this.userData.settings);
      }

      return this.rkBase.settings(
        function(error, response) {
          return callback(error, response);
        }
      );
    };
  this.getUserProfile =
    function(callback) {
      if (this.userData.user !== null) {
        return callback(null,
                         {
                           userJSON: this.userData.user,
                           profileJSON: this.userData.profile
                         }
                        );
      }

      return this.rkBase.user( //https://runkeeper.com/developer/healthgraph/users
        function(userError, userJSON) {
          if (userError === null) {
            this.userData.user = userJSON;

            return this.rkBase.profile( //https://runkeeper.com/developer/healthgraph/profile
              function(profileError, profileJSON) {
                this.userData.profile = profileError === null ? profileJSON : {};

                return callback(profileError,
                                 {
                                   userJSON: this.userData.user,
                                   profileJSON: this.userData.profile
                                 }
                                );
              }.bind(this)
            );
          }

          return callback(userError,
                            {
                              userJSON: this.userData.user, //.userJSON || {},
                              profileJSON: this.userData.profile
                            }
                          );

        }.bind(this)
      );
    };
};

exports.RkUser = RkUser;
