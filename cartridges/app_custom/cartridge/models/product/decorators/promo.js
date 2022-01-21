"use strict";
// function isPromo(promoMessage) {
//   return promoMessage === "PROMOTION";
// }

module.exports = function (object, product) {
  Object.defineProperty(object, "promoMessage", {
    enumerable: false,
    value: product.custom.promoMessage,
  });
  //   Object.defineProperty(object, "isPromo", {
  //     enumerable: false,
  //     value: isPromo(product.custom.promoMessage),
  //   });
};
