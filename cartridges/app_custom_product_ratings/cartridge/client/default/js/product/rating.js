"use strict";

var base = require("../../../../../../app_storefront_base/cartridge/client/default/js/util");

$("form.rate").on("submit", function (e) {
  e.preventDefault();
  var $form = $(this);
  var url = $form.attr("action");
  var formValues = $form.serialize();

  $.ajax({
    url: url,
    type: "post",
    data: formValues,
    success: function (data) {
      if (data.success) {
        $form.addClass("d-none");
        $("#rate-after").append(data.message);
        $("#rate-after").removeClass("d-none");
      }
    },
    error: function (err) {},
  });
});
<<<<<<< HEAD
=======

module.exports = base;
>>>>>>> parent of 3c1e7ecd (fixes)
