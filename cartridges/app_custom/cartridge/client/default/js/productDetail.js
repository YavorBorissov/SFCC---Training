var processInclude = require("../../../../../app_storefront_base/cartridge/client/default/js/util");

$(document).ready(function () {
  processInclude(require("./product/detail"));
  processInclude(require("./product/rating"));
});
