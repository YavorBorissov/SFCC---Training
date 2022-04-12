"use strict";

var base = module.superModule;

base.promo = require("*/cartridge/models/product/decorators/promo");
base.jokeTerm = require("*/cartridge/models/product/decorators/jokeTerm");
base.tags = require("*/cartridge/models/product/decorators/tags");
base.rating = require("*/cartridge/models/product/decorators/rating");

module.exports = base;
