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
  //   if ($email === "") {
  //     return false;S
  //   }
  //   if ($email !== "") {
  //     $.post(url, formValues, function (data) {
  //       // Display the returned data in browser
  //       $("#result").replaceWith(
  //         "<div class='avail-notification' style='text-align: center; border-style: dashed;'> <i><b>We'll notify you as soon as this product is available.</b></i></div>"
  //       );
  //       // .html(
  //       //   "<div class='avail-notification' style='text-align: center; border-style: dashed;'> <i><b>We'll notify you as soon as this product is available.</b></i></div>"
  //       // );
  //     });
  //   }
});

module.exports = base;
