var server = require("server");
var service = require("app_custom/cartridge/services/jokeservice");

server.get("Show", function (req, res, next) {
  var properties = {};
  var template = "jokeTemplate";

  var svcResult = service.dadJokeAPIService.call();
  if (svcResult.status === "OK") {
    properties.joke = svcResult.object.joke;
  }

  res.render(template, properties);
  next();
});

module.exports = server.exports();
