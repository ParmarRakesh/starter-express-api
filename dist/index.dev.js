"use strict";

var express = require("express");

var axios = require("axios");

var app = express();
app.get("/", function (req, res) {
  console.log("Just got a request!");
  res.send("Yo! Hello");
});
app.post("/product", function _callee2(request, response) {
  var json, id, config;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          json = {
            key: "hello"
          };
          console.log(request.body);
          console.log("test");
          id = request.body.id;
          config = {
            method: "get",
            url: "https://alittlething.co/wp-json/wc/v3/products/".concat(id),
            headers: {
              Authorization: "Basic Y2tfYjc2MjZmYWJhM2MzYTFkNWU0ZjMyYmNhMmQ5NGFjMTM1NWUzMjE1Mjpjc18yNGM0ZGU5ZDU1Y2Y0ZjExYTRiMmU3MWQ1NGVlOTJhMGE0MGExNzFm",
              Cookie: "PHPSESSID=ctdi4iuc2l05sqekepdm5cipqo; mailchimp_landing_site=https%3A%2F%2Falittlething.co%2Fwp-json%2Fwc%2Fv3%2Fproducts%2F20223; wfwaf-authcookie-65e717bb942274366e37ef93fe37e38d=827%7Cadministrator%7Cmanage_options%2Cunfiltered_html%2Cedit_others_posts%2Cupload_files%2Cpublish_posts%2Cedit_posts%2Cread%7Cd9099ef84dfa79b02b3d4953d5f9efab172e42b38fb73604655b25930e51fbee"
            }
          };
          axios(config).then(function _callee(res) {
            var ret;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    console.log(res.data.stock_quantity);
                    _context.next = 3;
                    return regeneratorRuntime.awrap(decrease_stock(res.data.stock_quantity, id));

                  case 3:
                    ret = _context.sent;
                    console.log("ret", ret);
                    response.send(res.data);

                  case 6:
                  case "end":
                    return _context.stop();
                }
              }
            });
          })["catch"](function (error) {
            console.log(error);
          }); // response.send(json);

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
});

function decrease_stock(stock, product_id) {
  var data, config;
  return regeneratorRuntime.async(function decrease_stock$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          stock = stock - 1;
          data = JSON.stringify({
            stock_quantity: stock
          });
          config = {
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
            console.log(response.data);
            return 1;
          })["catch"](function (error) {
            console.log(error);
          });

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
}

app.listen(process.env.PORT || 3000);