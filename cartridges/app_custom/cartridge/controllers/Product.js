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

module.exports = server.exports();
