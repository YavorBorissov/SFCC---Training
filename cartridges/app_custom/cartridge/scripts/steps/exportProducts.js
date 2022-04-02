var system = require("dw/system");
var catalog = require("dw/catalog");
var job = require("dw/job");
var io = require("dw/io");

var products;
var fileWriter;
var writer;

exports.beforeStep = function (parameters, stepExecution) {
  var path = new io.File(
    io.File.IMPEX + io.File.SEPARATOR + parameters.ExportFileName
  );

  if (!path.exists()) {
    path.mkdirs();
  }
  fileWriter = new io.FileWriter(path);
  writer = io.CSVStreamWriter(fileWriter);

  products = catalog.ProductMgr.queryAllSiteProducts();
};

// exports.getTotalCount = function (parameters, stepExecution) {
//   return products.count;
// };

exports.read = function (parameters, stepExecution) {
  if (products.hasNext()) {
    return products.next();
  }
};

exports.process = function (product, parameters, stepExecution) {
  return [
    product.ID,
    product.name,
    product.custom.joketerm,
    product.custom.tags,
    product.ProductPriceModel ? product.ProductPriceModel.price : "",
    product.primaryCategory ? product.primaryCategory.displayName : "",
    product.availabilityModel.inventoryRecord
      ? product.availabilityModel.inventoryRecord.ATS
      : "",
  ];
};

exports.write = function (lines, parameters, stepExecution) {
  writer.writeNext([
    "id",
    "name",
    "jokeTerm",
    "tags",
    "price",
    "primaryCategory",
    "availability",
  ]);
  for (i = 0; i < lines.size(); i++) {
    writer.writeNext(lines.get(i).toArray());
  }
};

exports.afterStep = function (success, parameters, stepExecution) {
  fileWriter.close();
  products.close();
};
