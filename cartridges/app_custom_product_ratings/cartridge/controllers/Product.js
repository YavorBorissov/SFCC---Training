"use strict";

var server = require("server");
var page = module.superModule;
server.extend(page);
var Site = require("dw/system/Site");

// server.append("Show", function (req, res, next) {
//   var randomStr = Site.getCurrent().getCustomPreferenceValue("randomStr");

//   var viewData = res.getViewData();
//   viewData.randomStr = randomStr;

//   res.setViewData(viewData);
//   next();
// });

var getCookie = function (name) {
  var cookies = request.getHttpCookies();
  for (var i in cookies) {
    if (cookies[i].name === name) {
      return cookies[i];
    }
  }
  return false;
};

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
  var accountHelpers = require("*/cartridge/scripts/account/accountHelpers");
  var accountModel = accountHelpers.getAccountModel(req);

  var Transaction = require("dw/system/Transaction");
  var CustomObjectMgr = require("dw/object/CustomObjectMgr");
  var Resource = require("dw/web/Resource");
  var Cookie = require("dw/web/Cookie");

  var cookie = getCookie("saveRating");
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

  var customObjectCount = function (pid) {
    var co = CustomObjectMgr.queryCustomObjects(
      "ProductRate",
      "custom.pid = {0}",
      null,
      pid
    );

    var count = co.getCount() !== -1 ? co.getCount() + 1 : 1;
    return count.toString();
  };

  Transaction.wrap(function () {
    var id = pid + "_" + customObjectCount(pid);
    if (!CustomObjectMgr.getCustomObject("ProductRate", id)) {
      var co = CustomObjectMgr.createCustomObject("ProductRate", id);
      co.custom.pid = pid;
      co.custom.rating = rate;
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

  var cookie = getCookie("saveRating");
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

module.exports = server.exports();
