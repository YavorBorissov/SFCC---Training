"use strict";

module.exports = function (object, product) {
  Object.defineProperty(object, "ratingSum", {
    enumerable: false,
    value: product.custom.ratingSum,
  });
  Object.defineProperty(object, "peopleSum", {
    enumerable: false,
    value: product.custom.peopleSum,
  });
};
