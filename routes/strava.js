var express = require("express");
var router = express.Router();
var util = require("util");
var stravaBaseWrapper = require("../models/strava/stBase.js");
var stActivityListWrapper = require("../models/strava/stActivityList.js");

router.get("/",
  function(req, resp, next) {
    var stBase = new stravaBaseWrapper.StBase(req.cookies.st_token);

    stBase.getAthleteData(function(error, payload) {
      if (error !== null && error.message !== "") {
        return resp.redirect("strava/connect?reason=Application%20not%20connected");
      }

      return resp.send([error, payload]);
    });
  }
);

router.get("/connect",
  function(req, resp, next) {
    var stBase = new stravaBaseWrapper.StBase(req.query.code);
    var auth_url = stBase.api.oauth.getRequestAccessURL({});
    resp.render("strava/connect.ejs",
                {
                  title: "Connect Strava",
                  reason: req.query.reason,
                  strava_auth_url: auth_url
                });
  }
);
router.get("/new_token",
  function(req, resp, next) {
    var stBase = new stravaBaseWrapper.StBase('');
    if (req.query.code !== "") {
      stBase.api.oauth.getToken(req.query.code,
                                  function(error, response) {
                                    resp.cookie("st_token", response.access_token);

                                    //resp.send([error, response]);
                                    resp.redirect("/");
                                  }
                                );
    }
  }
);
router.get("/activities",
  function(req, resp, next) {
    var stActivityList = new stActivityListWrapper.StActivityList(req.cookies.st_token);

    stActivityList.activityList(1,
      function(err, response) {
        resp.send([req.query.st_token, err, response]);
      }
    );
  }
);

module.exports = router;
