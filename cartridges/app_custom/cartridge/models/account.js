"use strict";

var base = module.superModule;

var AddressModel = require("*/cartridge/models/address");
var URLUtils = require("dw/web/URLUtils");
var Customer = require("dw/customer/Customer");

function account(currentCustomer, addressModel, orderModel) {
  base.call(this, currentCustomer, addressModel, orderModel);
  this.profile.username = currentCustomer.raw.profile.custom.username;
  this.profile.status = currentCustomer.raw.profile.custom.status;
}

module.exports = account;
