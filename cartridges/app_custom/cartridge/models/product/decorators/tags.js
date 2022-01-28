"use strict";

module.exports = function (object, product) {
  Object.defineProperty(object, "tags", {
    enumerable: true,
    value: product.custom.tags,
  });
};
