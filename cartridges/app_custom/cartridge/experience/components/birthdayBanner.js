"use strict";
var Template = require("dw/util/Template");
var HashMap = require("dw/util/HashMap");
var ImageTransformation = require("*/cartridge/experience/utilities/ImageTransformation.js");
/**
 * Render logic for the component.
 */
module.exports.render = function (context) {
  var model = new HashMap();
  // add parameters to model as required for rendering based on the given context
  var content = context.content;

  model.image = ImageTransformation.getScaledImage(content.image);
  model.text = content.text ? content.text : "";

  return new Template(
    "experience/components/commerce_assets/birthdayBanner"
  ).render(model).text;
};
