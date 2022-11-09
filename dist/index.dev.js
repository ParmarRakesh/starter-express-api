"use strict";

var express = require("express");

var axios = require("axios");

var app = express(); // For parsing application/json

app.use(express.json());
var port = process.env.port || 3000; // For parsing application/x-www-form-urlencoded

app.use(express.urlencoded({
  extended: true
}));
app.get("/", function (req, res) {
  console.log("Just got a request!");
  res.send("Yo! Hello");
});

function get_stock(product_id) {
  return regeneratorRuntime.async(function get_stock$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", new Promise(function (resolve, reject) {
            var config = {
              method: "get",
              url: "https://alittlething.co/wp-json/wc/v3/products/".concat(product_id),
              headers: {
                Authorization: "Basic Y2tfYjc2MjZmYWJhM2MzYTFkNWU0ZjMyYmNhMmQ5NGFjMTM1NWUzMjE1Mjpjc18yNGM0ZGU5ZDU1Y2Y0ZjExYTRiMmU3MWQ1NGVlOTJhMGE0MGExNzFm",
                Cookie: "PHPSESSID=ctdi4iuc2l05sqekepdm5cipqo; mailchimp_landing_site=https%3A%2F%2Falittlething.co%2Fwp-json%2Fwc%2Fv3%2Fproducts%2F20223; wfwaf-authcookie-65e717bb942274366e37ef93fe37e38d=827%7Cadministrator%7Cmanage_options%2Cunfiltered_html%2Cedit_others_posts%2Cupload_files%2Cpublish_posts%2Cedit_posts%2Cread%7Cd9099ef84dfa79b02b3d4953d5f9efab172e42b38fb73604655b25930e51fbee"
              }
            };
            axios(config).then(function _callee(res) {
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      console.log("Current Quantity: ", res.data.stock_quantity);
                      resolve(res.data.stock_quantity);

                    case 2:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            })["catch"](function (error) {
              console.log(error);
            });
          }));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function decrease_stock(stock, product_id) {
  return regeneratorRuntime.async(function decrease_stock$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", new Promise(function (resolve, reject) {
            stock = stock - 1;
            var data = JSON.stringify({
              stock_quantity: stock
            });
            var config = {
              method: "put",
              url: "https://alittlething.co/wp-json/wc/v3/products/".concat(product_id),
              headers: {
                Authorization: "Basic Y2tfYjc2MjZmYWJhM2MzYTFkNWU0ZjMyYmNhMmQ5NGFjMTM1NWUzMjE1Mjpjc18yNGM0ZGU5ZDU1Y2Y0ZjExYTRiMmU3MWQ1NGVlOTJhMGE0MGExNzFm",
                "Content-Type": "application/json",
                Cookie: "PHPSESSID=ctdi4iuc2l05sqekepdm5cipqo; mailchimp_landing_site=https%3A%2F%2Falittlething.co%2Fwp-json%2Fwc%2Fv3%2Fproducts%2F20186; wfwaf-authcookie-65e717bb942274366e37ef93fe37e38d=827%7Cadministrator%7Cmanage_options%2Cunfiltered_html%2Cedit_others_posts%2Cupload_files%2Cpublish_posts%2Cedit_posts%2Cread%7C7f126310333728ebad0db9da48b967fded175b927eabb592c4f3bc8d7e2d2ab3"
              },
              data: data
            };
            axios(config).then(function (response) {
              //console.log(response.data);
              resolve(response.data.stock_quantity);
            })["catch"](function (error) {
              console.log(error);
            });
          }));

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function increase_stock(stock, product_id) {
  return regeneratorRuntime.async(function increase_stock$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          return _context4.abrupt("return", new Promise(function (resolve, reject) {
            var y = 0;
            stock = stock + 1;
            var data = JSON.stringify({
              stock_quantity: stock
            });
            var config = {
              method: "put",
              url: "https://alittlething.co/wp-json/wc/v3/products/".concat(product_id),
              headers: {
                Authorization: "Basic Y2tfYjc2MjZmYWJhM2MzYTFkNWU0ZjMyYmNhMmQ5NGFjMTM1NWUzMjE1Mjpjc18yNGM0ZGU5ZDU1Y2Y0ZjExYTRiMmU3MWQ1NGVlOTJhMGE0MGExNzFm",
                "Content-Type": "application/json",
                Cookie: "PHPSESSID=ctdi4iuc2l05sqekepdm5cipqo; mailchimp_landing_site=https%3A%2F%2Falittlething.co%2Fwp-json%2Fwc%2Fv3%2Fproducts%2F20186; wfwaf-authcookie-65e717bb942274366e37ef93fe37e38d=827%7Cadministrator%7Cmanage_options%2Cunfiltered_html%2Cedit_others_posts%2Cupload_files%2Cpublish_posts%2Cedit_posts%2Cread%7C7f126310333728ebad0db9da48b967fded175b927eabb592c4f3bc8d7e2d2ab3"
              },
              data: data
            };
            axios(config).then(function (response) {
              console.log(response.data.stock_quantity);
              resolve(response.data.stock_quantity);
            })["catch"](function (error) {
              console.log(error);
            });
          }));

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
}

app.post("/increase", function _callee2(request, response) {
  var json, id, current_stock, increased_stock;
  return regeneratorRuntime.async(function _callee2$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          json = {
            key: "hello"
          };
          console.log(request.body);
          console.log("test");
          id = request.body.id;
          _context5.next = 6;
          return regeneratorRuntime.awrap(get_stock(id));

        case 6:
          current_stock = _context5.sent;
          console.log("current Stock", current_stock); // const decreased_stock = await decrease_stock(current_stock, id);

          _context5.next = 10;
          return regeneratorRuntime.awrap(increase_stock(current_stock, id));

        case 10:
          increased_stock = _context5.sent;
          console.log("increased stock:", increased_stock);
          response.send({
            sku_id: id,
            current_stock: current_stock,
            increased_stock: increased_stock
          }); // response.send(json);

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  });
});
app.post("/decrease", function _callee3(request, response) {
  var json, id, current_stock, decreased_stock;
  return regeneratorRuntime.async(function _callee3$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          json = {
            key: "hello"
          };
          console.log(request.body);
          console.log("test");
          id = request.body.id;
          _context6.next = 6;
          return regeneratorRuntime.awrap(get_stock(id));

        case 6:
          current_stock = _context6.sent;
          console.log("current Stock", current_stock);
          _context6.next = 10;
          return regeneratorRuntime.awrap(decrease_stock(current_stock, id));

        case 10:
          decreased_stock = _context6.sent;
          //const increased_stock = await increase_stock(current_stock, id);
          //console.log("increased stock:", increased_stock);
          response.send({
            sku_id: id,
            current_stock: current_stock,
            decreased_stock: decreased_stock
          }); // response.send(json);

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  });
});
app.listen(port, function () {
  console.log("Listening on port ".concat(port));
});