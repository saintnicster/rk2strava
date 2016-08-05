// RunKeeper.js
var request = require("request");
var querystring = require("querystring");

// Predefined API Routes
var API = {
  "user": {
    "Content-Type": "application/vnd.com.runkeeper.User+json",
    "uri": "/user"
        },
  "profile": {
      "Content-Type": "application/vnd.com.runkeeper.Profile+json",
      "uri": "/profile"
        },
  "settings": {
      "Content-Type": "application/vnd.com.runkeeper.Settings+json",
      "uri": "/settings"
        },
  "fitnessActivityFeed": {
    "Content-Type": "application/vnd.com.runkeeper.FitnessActivityFeed+json",
    "uri": "/fitnessActivities"
        },
  "fitnessActivities": {
    "Content-Type": "application/vnd.com.runkeeper.FitnessActivity+json",
    "uri": "/fitnessActivities"
  }
};

var HealthGraph = exports.HealthGraph = function(options) {

    this.client_id = options.client_id || null;
    this.client_secret = options.client_secret || null;
    this.auth_url = options.auth_url || "https://runkeeper.com/apps/authorize";
    this.access_token_url = options.access_token_url || "https://runkeeper.com/apps/token";
    this.redirect_uri = options.redirect_uri || null;

    this.access_token = options.access_token || null;

    this.api_domain = options.api_domain || "api.runkeeper.com";

};

// Runkeeper OAuth docs: http://developer.runkeeper.com/healthgraph/registration-authorization
// @state - state code that is passed and returned back from Runkeeper
// @return URL for user to
HealthGraph.prototype.getRequestAccessURL = function(state) {
  var oauthArgs = {
                    client_id: this.client_id,
                    redirect_uri: this.redirect_uri,
                    response_type: "code",
                    state: state || ""
                  };

  var url = this.auth_url + "?" + querystring.stringify(oauthArgs);

  return url;
};
// TODO: Add Authorization Code step (Step 1)
// getToken performs Step 2
HealthGraph.prototype.getNewToken = function (authorization_code, callback) {

    var request_params = {
		grant_type: "authorization_code",
		code: authorization_code,
		client_id: this.client_id,
		client_secret: this.client_secret,
		redirect_uri: this.redirect_uri
    };

    var paramlist = [];
    for (pk in request_params) {
      paramlist.push(pk + "=" + request_params[pk]);
    }
    var body_string = paramlist.join("&");

    var request_details = {
		method: "POST",
		headers: {"Content-Type": "application/x-www-form-urlencoded"},
		uri: this.access_token_url,
		body: body_string
    };

    request(request_details, function(error, response, body) {
      callback(error, JSON.parse(body).access_token, response);
    });
};
// Generic API Call Wrapper for interacting with API Routes not otherwise specified.
// @method: optional, defaults to GET
// @media_type: required, this is the media type specified for the desired resource
// @endpoint: required, this is the specific API endpoint of the desired resource
// @callback: required, this is the callback function to pass any errors and the body of the API response to
HealthGraph.prototype.apiCall = function(method, media_type, endpoint, callback) {
	var request_details = {
		method: method || "GET",
		headers: {
  "Accept": media_type,
	              "Authorization": "Bearer " + this.access_token
},
		uri: "https://" + this.api_domain + endpoint
	};
	request(request_details, function(error, response, body) {
    var parsed;
		try {
			parsed = JSON.parse(body);
		} catch (e) {
      if (typeof response !== "undefined") {
        error = new Error("Body reply is not a valid JSON string.");
        error.statusCode = response.statusCode;
        error.statusMessage = response.statusMessage;
      }
      error.runkeeperBody = body;
      error.uri = request_details.uri;
      error.request_details = request_details;
		} finally {
			callback(error, parsed, response);
		}
	});
};


// Generate Specific API Methods based on Predefined API Routes
for (func_name in API) {
    HealthGraph.prototype[func_name] = (function(func_name) {
      return function(callback) {
        var request_details = {
                                method: API[func_name]["method"] || "GET",
                                headers: {
                                  "Accept": API[func_name]["media_type"],
                                  "Authorization": "Bearer " + this.access_token
                                },
                                uri: "https://" + this.api_domain + API[func_name]["uri"]
                              };
        request(request_details,
          function(error, response, body) {
            var parsed = "";
            try {
              if (error != null) {
                throw (error);
              }

              parsed = JSON.parse(body);
              //console.log(func_name + " - " + response.statusCode);
              if (typeof parsed.reason !== "undefined") {
                throw ("User - " + parsed.reason);
              }
            } catch (e) {
              error = (typeof e === "object") ? e : new Error(e);

              if (typeof response !== "undefined") {
                error.statusCode = response.statusCode;
                error.statusMessage = response.statusMessage;
              }
              error.runkeeperBody = parsed || body;
              error.uri = request_details.uri;
              error.request_details = request_details;

              //console.log(parsed);
            } finally {
              callback(error, parsed);
            }
          }
        );
      };
  })(func_name);
}
