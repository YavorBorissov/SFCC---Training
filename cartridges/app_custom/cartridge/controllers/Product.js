"use strict";

var server = require("server");
var page = module.superModule;
server.extend(page);
var Site = require("dw/system/Site");

server.append("Show", function (req, res, next) {
  var randomStr = Site.getCurrent().getCustomPreferenceValue("randomStr");

  var viewData = res.getViewData();
  viewData.randomStr = randomStr;

  res.setViewData(viewData);
  next();
});

var getCookie = function (name) {
  var cookies = request.getHttpCookies();
  for (var i in cookies) {
    if (cookies[i].name === name) {
      return cookies[i];
    }
  }
  return false;
};

server.post("Subscribe", function (req, res, next) {
  var accountHelpers = require("*/cartridge/scripts/account/accountHelpers");
  var accountModel = accountHelpers.getAccountModel(req);

  var Transaction = require("dw/system/Transaction");
  var CustomObjectMgr = require("dw/object/CustomObjectMgr");
  var Resource = require("dw/web/Resource");
  var URLUtils = require("dw/web/URLUtils");
  var Cookie = require("dw/web/Cookie");
  var Profile = require("dw/customer/Profile");

  var cookie = getCookie("savePid");
  var productIDs = { pids: [] };

  if (cookie) {
    productIDs = JSON.parse(cookie.getValue());
  }

  if (!productIDs.pids.includes(req.form.pid)) {
    productIDs.pids.push(req.form.pid);

    var saveProductCookie = new Cookie("savePid", JSON.stringify(productIDs));
    response.addHttpCookie(saveProductCookie);
  }

  var email = req.form.email;
  var pid = req.form.pid;
  var name = accountModel
    ? accountModel.profile.firstName
    : Resource.msg("message.guest", "welcome", null);

  try {
    Transaction.wrap(function () {
      if (
        !CustomObjectMgr.getCustomObject("ProductSubscribe", pid + "_" + email)
      ) {
        var co = CustomObjectMgr.createCustomObject(
          "ProductSubscribe",
          pid + "_" + email
        );
        co.custom.email = email;
        co.custom.pid = pid;
        co.custom.name = name;
      }
    });

    res.json({
      success: true,
      message: Resource.msg("message.success", "subscribe-form", null),
    });
  } catch (e) {
    res.json({ success: false });
  }
  res.redirect(URLUtils.url("Product-Show", "pid", pid));
  next();
});

server.append("Show", function (req, res, next) {
  var viewData = res.getViewData();
  var isAvailable = false;
  if (viewData.product.available) {
    isAvailable = true;
  }

  var cookie = getCookie("savePid");
  var isSubscribed = false;
  if (cookie) {
    var pidsObj = JSON.parse(cookie.value);
    if (pidsObj.pids.includes(viewData.product.id)) isSubscribed = true;
  }

  viewData.isAvailable = isAvailable;
  viewData.isSubscribed = isSubscribed;
  res.setViewData(viewData);
  next();
});

module.exports = server.exports();
