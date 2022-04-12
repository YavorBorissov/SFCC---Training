"use strict";

var server = require("server");
var page = module.superModule;
server.extend(page);
var Site = require("dw/system/Site");

var cookieHelper = require("*/cartridge/scripts/helpers/cookieHelper");

function containsObject(obj, list) {
  var i;
  for (i in list) {
    if (list.hasOwnProperty(i) && list[i] === obj) {
      return true;
    }
  }

  return false;
}

server.post("Rate", function (req, res, next) {
  var Transaction = require("dw/system/Transaction");
  var CustomObjectMgr = require("dw/object/CustomObjectMgr");
  var Resource = require("dw/web/Resource");
  var Cookie = require("dw/web/Cookie");

  var cookie = cookieHelper.getCookie("saveRating");
  var cookieJson = { ratings: [] };

  var pid = req.form.pid;
  var rate = req.form.rate;

  var obj = {};
  obj["pid"] = pid;
  obj["rate"] = rate;

  if (cookie) {
    cookieJson = JSON.parse(cookie.getValue());
  }

  var contains = containsObject(obj, cookieJson.ratings);

  if (!contains) {
    cookieJson.ratings.push(obj);

    var saveProductCookie = new Cookie(
      "saveRating",
      JSON.stringify(cookieJson)
    );
    response.addHttpCookie(saveProductCookie);
  }

  Transaction.wrap(function () {
    if (!CustomObjectMgr.getCustomObject("ProductRatingSum", pid)) {
      var co = CustomObjectMgr.createCustomObject("ProductRatingSum", pid);
      var ratingSum = rate;
      var peopleSum = 1;
      co.custom.ratingSum = ratingSum;
      co.custom.peopleSum = peopleSum;
    } else if (CustomObjectMgr.getCustomObject("ProductRatingSum", pid)) {
      var co = CustomObjectMgr.getCustomObject("ProductRatingSum", pid);
      var ratingSum = parseInt(co.custom.ratingSum) + parseInt(rate);
      var peopleSum = parseInt(co.custom.peopleSum) + 1;
      co.custom.ratingSum = ratingSum;
      co.custom.peopleSum = peopleSum;
    }
  });

  res.json({
    success: true,
    message: Resource.msg("message.thank.you", "product-rating", null),
  });

  next();
});

server.append("Show", function (req, res, next) {
  var viewData = res.getViewData();

  var cookie = cookieHelper.getCookie("saveRating");
  var hasRated = false;
  if (cookie) {
    var valuesObj = JSON.parse(cookie.value);
    hasRated = valuesObj.ratings.some(
      (object) => object.pid === viewData.product.id
    );
  }

  viewData.hasRated = hasRated;
  res.setViewData(viewData);
  next();
});

server.append("Show", function (req, res, next) {
  var viewData = res.getViewData();

  // viewData.peopleSum = peopleSum;
  res.setViewData(viewData);
  next();
});

module.exports = server.exports();
