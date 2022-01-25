"use strict";

var base = module.superModule;

base.promo = require("*/cartridge/models/product/decorators/promo");
base.jokeTerm = require("*/cartridge/models/product/decorators/jokeTerm");

module.exports = base;
