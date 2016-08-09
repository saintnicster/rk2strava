var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index",
              {
                title: "Express Index",
                rk_token: req.cookies.rk_token,
                st_token: req.cookies.st_token
              }
            );
});

module.exports = router;
