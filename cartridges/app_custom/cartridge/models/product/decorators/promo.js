"use strict";

module.exports = function (object, product) {
  Object.defineProperty(object, "promoMessage", {
    enumerable: false,
    value: product.custom.promoMessage,
  });
};
