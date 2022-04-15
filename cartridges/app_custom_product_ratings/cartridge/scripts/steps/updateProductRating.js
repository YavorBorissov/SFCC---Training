var system = require("dw/system");
var catalog = require("dw/catalog");
var job = require("dw/job");
var io = require("dw/io");
var CustomObjectMgr = require("dw/object/CustomObjectMgr");

var FileWriter = require("dw/io/FileWriter");
var File = require("dw/io/File");
var XMLStreamWriter = require("dw/io/XMLStreamWriter");

var fileWriter;
var xsw;
// var writer;
var objects;

exports.beforeStep = function (parameters, stepExecution) {
  // var path = new io.File(
  //   io.File.IMPEX + io.File.SEPARATOR + parameters.ExportFileName
  // );

  // if (!path.exists()) {
  //   path.mkdirs();
  // }
  // fileWriter = new io.FileWriter(path);
  // writer = io.XMLStreamWriter(fileWriter);

  var xmlFile = new File(
    File.IMPEX +
      File.SEPARATOR +
      "src" +
      File.SEPARATOR +
      parameters.ExportFileName +
      ".xml"
  );
  fileWriter = new FileWriter(xmlFile, "UTF-8");
  xsw = new XMLStreamWriter(fileWriter);

  objects = CustomObjectMgr.getAllCustomObjects("ProductRatingSum");
};

exports.read = function (parameters, stepExecution) {
  if (objects.hasNext()) {
    return objects.next();
  }
};

exports.process = function (object, parameters, stepExecution) {
  return [object.custom.id, object.custom.ratingSum, object.custom.peopleSum];
};

exports.write = function (lines, parameters, stepExecution) {
  xsw.writeStartDocument("UTF-8", "1.0");
  xsw.writeStartElement("catalog");
  xsw.writeAttribute(
    "xmlns",
    "http://www.demandware.com/xml/impex/catalog/2006-10-31"
  );
  xsw.writeAttribute("catalog-id", "master-catalog-training");

  for (i = 0; i < lines.size(); i++) {
    var currentObject = lines.get(i);

    xsw.writeStartElement("product");
    xsw.writeAttribute("product-id", currentObject[0]);
    xsw.writeStartElement("custom-attributes");
    xsw.writeStartElement("custom-attribute");
    xsw.writeAttribute("attribute-id", "ratingSum");
    xsw.writeCharacters(currentObject[1]);
    xsw.writeEndElement();
    xsw.writeStartElement("custom-attribute");
    xsw.writeAttribute("attribute-id", "peopleSum");
    xsw.writeCharacters(currentObject[2]);
    xsw.writeEndElement();
    xsw.writeEndElement();
    xsw.writeEndElement();
  }

  xsw.writeEndElement();
  xsw.writeEndDocument();
};

exports.afterStep = function (success, parameters, stepExecution) {
  xsw.close();
  fileWriter.close();
  objects.close();
};
