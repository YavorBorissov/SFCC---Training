var system = require("dw/system");
var catalog = require("dw/catalog");
var CustomObjectMgr = require("dw/object/CustomObjectMgr");
var Transaction = require("dw/system/Transaction");
var job = require("dw/job");
var io = require("dw/io");

var service = require("app_custom/cartridge/services/jokeservice");

var products;
var searchTerm;
var searchTermArr = [];

exports.run = function () {
  products = catalog.ProductMgr.queryAllSiteProducts();

  while (products.hasNext()) {
    var product = products.next();
    searchTerm = product.custom.jokeTerm;
    if (searchTerm && !searchTermArr.includes(searchTerm))
      searchTermArr.push(searchTerm);
  }

  var url = service.dadJokeAPIService.getURL() + "search";

  searchTermArr.forEach(function (term) {
    var svcResult = service.dadJokeAPIService.call({ term: term });

    var jokes = svcResult.object.results;
    var obj = {};

    jokes.forEach(function (joke, index) {
      if (!CustomObjectMgr.getCustomObject("jokeDetails", joke.id)) {
        Transaction.wrap(function () {
          obj = CustomObjectMgr.createCustomObject("jokeDetails", joke.id);
          obj.custom.term = term;
          obj.custom.message = joke.joke;
        });
      }
    });
  });
};
