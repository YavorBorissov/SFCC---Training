"use strict";

var base = require("../../../../../../app_storefront_base/cartridge/client/default/js/util");

$("form.subscribe-form").on("submit", function (e) {
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
        $("#result").append(data.message);
        $("#result").removeClass("d-none");
      }
    },
    error: function (err) {},
  });
});

module.exports = base;
