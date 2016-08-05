var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  //console.log(req);
  res.render("index",
              {
                title: "Express Index",
                rk_token: req.cookies.rk_token
              }
            );
});

module.exports = router;
