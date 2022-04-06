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
  var URLUtils = require("dw/web/URLUtils");
  var Cookie = require("dw/web/Cookie");
  var Profile = require("dw/customer/Profile");

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

  var bol = containsObject(obj, cookieJson.ratings);

  if (!bol) {
    cookieJson.ratings.push(obj);

    var saveProductCookie = new Cookie(
      "saveRating",
      JSON.stringify(cookieJson)
    );
    response.addHttpCookie(saveProductCookie);
  }

  // var name = accountModel
  //   ? accountModel.profile.firstName
  //   : Resource.msg("message.guest", "welcome", null);

  res.json({
    success: true,
    message: Resource.msg("message.thank.you", "product-rating", null),
  });

  // try {
  //   Transaction.wrap(function () {
  //     if (
  //       !CustomObjectMgr.getCustomObject("ProductSubscribe", pid + "_" + email)
  //     ) {
  //       var co = CustomObjectMgr.createCustomObject(
  //         "ProductSubscribe",
  //         pid + "_" + email
  //       );
  //       co.custom.email = email;
  //       co.custom.pid = pid;
  //       co.custom.name = name;
  //     }
  //   });

  //   res.json({
  //     success: true,
  //     message: Resource.msg("message.success", "subscribe-form", null),
  //   });
  // } catch (e) {
  //   res.json({ success: false });
  // }
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
