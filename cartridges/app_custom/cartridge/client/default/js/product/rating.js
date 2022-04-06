"use strict";

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
        $("#rate-after").addClass("alert");
        $("#rate-after").addClass("alert-warning");
        $("#rate-after").addClass("alert-rate");
      }
    },
    error: function (err) {},
  });
});

module.exports = base;
