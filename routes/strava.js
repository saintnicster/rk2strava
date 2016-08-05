var express = require("express");
var router = express.Router();
var util = require("util");
var stravaBaseWrapper = require("../models/strava/stBase.js");

router.get("/",
  function(req, resp, next) {
    var stBase = new stravaBaseWrapper.StBase();
    stBase.getAthleteData(function(error, payload) {
      resp.send([error, payload]);
    });
  }
);
router.get("/connect",
  function(req, resp, next) {
    if (req.query.code !== "") {
      resp.cookie(st_token, req.query.code);
    }

    var stBase = new stravaBaseWrapper.StBase();

    resp.send("<a href=\"" + stBase.api.oauth.getRequestAccessURL({}) + "\">connect</a>");
  }
);

module.exports = router;
