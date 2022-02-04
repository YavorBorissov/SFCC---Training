"use strict";
var server = require("server");
var URLUtils = require("dw/web/URLUtils");
var csrfProtection = require("*/cartridge/scripts/middleware/csrf");
var userLoggedIn = require("*/cartridge/scripts/middleware/userLoggedIn");

server.get(
  "Show",
  server.middleware.https,
  csrfProtection.generateToken,
  userLoggedIn.validateLoggedIn,
  function (req, res, next) {
    var accountHelpers = require("*/cartridge/scripts/account/accountHelpers");
    var accountModel = accountHelpers.getAccountModel(req);

    var actionUrl = URLUtils.url("UserDetails-SaveDetails");
    var userDetailsForm = server.forms.getForm("userDetails");
    userDetailsForm.clear();

    userDetailsForm.firstname.value = accountModel.profile.firstName;
    userDetailsForm.lastname.value = accountModel.profile.lastName;
    userDetailsForm.phone.value = accountModel.profile.phone;
    userDetailsForm.username.value = accountModel.profile.username;
    userDetailsForm.status.value = accountModel.profile.status;

    res.render("userDetailsTemplate", {
      actionUrl: actionUrl,
      userDetailsForm: userDetailsForm,
    });
    next();
  }
);

server.post("SaveDetails", server.middleware.https, function (req, res, next) {
  var userDetailsForm = server.forms.getForm("userDetails");
  var Transaction = require("dw/system/Transaction");
  var CustomerMgr = require("dw/customer/CustomerMgr");

  var customer = CustomerMgr.getCustomerByCustomerNumber(
    req.currentCustomer.profile.customerNo
  );

  Transaction.wrap(function () {
    customer.profile.firstName = userDetailsForm.firstname.value;
    customer.profile.lastName = userDetailsForm.lastname.value;
    customer.profile.phoneHome = userDetailsForm.phone.value;
    customer.profile.custom.username = userDetailsForm.username.value;
    customer.profile.custom.status = userDetailsForm.status.value;
  });
});

module.exports = server.exports();
