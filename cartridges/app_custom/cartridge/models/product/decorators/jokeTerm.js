"use strict";

module.exports = function (object, product) {
  Object.defineProperty(object, "jokeTerm", {
    enumerable: false,
    value: product.custom.jokeTerm,
  });
};
