var express = require("express");
var router = express.Router();
var util = require("util");
var rkBaseWrapper = require("../models/RK/rkBase.js");
var rkUserWrapper = require("../models/RK/rkUser.js");
var RkActivityListWrapper = require("../models/RK/RkActivityList.js");

router.get("/user",
  function(req, resp, next) {
    var rkUser = new rkUserWrapper.RkUser(req.cookies.rk_token);

    if (!req.cookies.rk_token) {
      resp.redirect("/runkeeper/connect?reason=Application not connected");
    }

    rkUser.getUserProfile(
        function(error, profile) {
          if (error !== null && error !== { }) {
            resp.send((error !== null) + " || " + (error !== { }));
            console.log(util.inspect(error) + typeof error);
            if (error.runkeeperBody.reason === "Revoked") {
              resp.clearCookie("rk_token");

              return resp.redirect("/runkeeper/connect?reason=" + error.message);
            }

            return next(error);
          }
          //resp.set("Content-Type", "application/json");

          //return resp.send(util.inspect([error, profile]).toString());
          return resp.render("runkeeper/user.ejs", {profileJSON: profile.profileJSON});
        }
      );
    }
);

router.get("/",
  function(req, resp) {
    var rkBase = new rkBaseWrapper.RkBase(req.cookies.rk_token);

    if (req.cookies.rk_token) {
      return resp.redirect("/runkeeper/user");
    } else if (req.query.code) {
      return rkBase.getNewToken(req.query.code,
                         function(error, access_token) {
                            resp.cookie("rk_token", access_token);

                            return resp.redirect("/");
                          }
                        );
    }

    return resp.redirect("/runkeeper/connect");
  }
);

router.get("/connect",
  function(req, resp, next) {
    var rkBase = {};
    rkBase = new rkBaseWrapper.RkBase(req.cookies.rk_token);

    return resp.render("runkeeper/connect.ejs",
                        {
                          title: "Connect Runkeeper",
                          reason: req.query.reason,
                          rk_auth_url: rkBase.getRequestAccessURL("")
                        });
  });

router.get("/activities",
  function(req, resp, next) {
    var rkActivityList = new RkActivityListWrapper.RkActivityList(req.cookies.rk_token);

    rkActivityList.rkBase.isAuthenticated(
      function(authResponse) {
        if (!authResponse) {
          return resp.redirect("/runkeeper/connect");
        }

        return rkActivityList.activityCount(
          function(error, size) {
            rkActivityList.rkBase.settings(
              function(settingError, settings) {
                rkActivityList.activityList(size.size, 1,
                  function(listError, activities) {
                    resp.render("runkeeper/activity_list",
                                {
                                  items: activities.items,
                                  distance_unit: settings.distance_units
                                }
                              );
                  });
              }
            );
          });
      });
  });
module.exports = router;

// function saveJson(object, filename) {
//   var fs = require('fs');
//   var fileString = JSON.stringify(object, null, '\t');
//   fs.writeFile(filename, fileString, {encoding:'utf8'}, function(err){
//                 if(!err) console.log("File written to "+filename);
//                 else console.log(err);
//               });
// }
//
