var system = require("dw/system");
var catalog = require("dw/catalog");
var job = require("dw/job");
var io = require("dw/io");
var Template = require("dw/util/Template");
var HashMap = require("dw/util/HashMap");
var Resource = require("dw/web/Resource");
var Transaction = require("dw/system/Transaction");
var CustomObjectMgr = require("dw/object/CustomObjectMgr");
var Mail = require("dw/net/Mail");
var products;

// var ProductSearchModel = require("dw/catalog/ProductSearchModel");
// var productSearchModel = new ProductSearchModel();
// productSearchModel.setCategoryID("root");
// productSearchModel.search();

exports.run = function () {
  products = catalog.ProductMgr.queryAllSiteProducts();
  // products = productSearchModel.getProductSearchHits();

  var arr = [];
  var mailsWithPid = function (pid) {
    var co = CustomObjectMgr.queryCustomObjects(
      "ProductSubscribe",
      "custom.pid = {0}",
      null,
      pid
    );
    while (co.hasNext()) {
      var obj = co.next();
      var user = new Object();
      user.email = obj.custom.email;
      user.name = obj.custom.name;
      user.pid = obj.custom.pid;
      arr.push(user);
      Transaction.wrap(function () {
        CustomObjectMgr.remove(obj);
      });
    }
    return arr;
  };

  var sendMail = function (email, name, pid, product) {
    var mail = new Mail();
    var template = new Template("product/components/availabilityEmail");
    var map = new HashMap();
    name != null && name != "Guest"
      ? map.put("name", name)
      : map.put(
          "name",
          Resource.msg("message.guest.there", "subscribe-form", null)
        );
    map.put("pid", pid);
    map.put("pname", product.name);

    var text = template.render(map);

    mail.setFrom("noreply@us01.dx.commercecloud.salesforce.com");
    mail.addTo(email);
    var list = mail.getTo();
    mail.setTo(list);
    mail.setSubject("Product availability");
    mail.setContent(text);

    mail.send();
  };

  while (products.hasNext()) {
    var product = products.next();
    arr.push(mailsWithPid(product.ID)); //productID
    arr.forEach((item) => {
      sendMail(item.email, item.name, item.pid, product);
    });
    arr = [];
  }
};
