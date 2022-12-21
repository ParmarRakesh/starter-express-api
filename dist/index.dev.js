"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var express = require("express");

var axios = require("axios");

var https = require("https");

var app = express(); // For parsing application/json

var perfexCntrl = require("./controller/perfexCntrl");

app.use(express.json());
var port = process.env.port || 3000;

var WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api")["default"]; // import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; // Supports ESM


var WooCommerce = new WooCommerceRestApi({
  url: "https://alittlething.co",
  consumerKey: "ck_b7626faba3c3a1d5e4f32bca2d94ac1355e32152",
  consumerSecret: "cs_24c4de9d55cf4f11a4b2e71d54ee92a0a40a171f",
  version: "wc/v3"
}); // For parsing application/x-www-form-urlencoded

app.use(express.urlencoded({
  extended: true
}));
app.get("/", function (req, res) {
  console.log("Just got a request!");
  res.send("Yo! Hello");
});

function get_stock(product_id) {
  var response;
  return regeneratorRuntime.async(function get_stock$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(WooCommerce.get("products/".concat(product_id)));

        case 3:
          response = _context.sent;
          console.log(response.data.stock_quantity);
          return _context.abrupt("return", response.data.stock_quantity);

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0.response.data);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
}

function decrease_stock(product_id) {
  var current_stock, data, response1;
  return regeneratorRuntime.async(function decrease_stock$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(get_stock(product_id));

        case 3:
          current_stock = _context2.sent;
          console.log(_typeof(current_stock));
          console.log("current_stock:".concat(current_stock));
          current_stock = current_stock - 1;
          data = {
            stock_quantity: current_stock
          };
          console.log("current_stock", current_stock);
          _context2.next = 11;
          return regeneratorRuntime.awrap(WooCommerce.put("products/".concat(product_id), data));

        case 11:
          response1 = _context2.sent;
          console.log("\n        sku_id: ".concat(product_id, ",\n        decreased_stock: ").concat(response1.data.stock_quantity, ",\n       "));
          return _context2.abrupt("return", response1.data.stock_quantity);

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0.response.data);

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 16]]);
}

function increase_stock(product_id) {
  var current_stock, data, response1;
  return regeneratorRuntime.async(function increase_stock$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(get_stock(product_id));

        case 3:
          current_stock = _context3.sent;
          console.log(_typeof(current_stock));
          console.log("current_stock:".concat(current_stock));
          current_stock = current_stock + 1;
          data = {
            stock_quantity: current_stock
          };
          console.log("current_stock", current_stock);
          _context3.next = 11;
          return regeneratorRuntime.awrap(WooCommerce.put("products/".concat(product_id), data));

        case 11:
          response1 = _context3.sent;
          console.log("\n        sku_id: ".concat(product_id, ",\n        decreased_stock: ").concat(response1.data.stock_quantity, ",\n       "));
          return _context3.abrupt("return", response1.data.stock_quantity);

        case 16:
          _context3.prev = 16;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0.response.data);

        case 19:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 16]]);
}

app.post("/route", function _callee(request, response) {
  var sample, res, newContact, newInvoice;
  return regeneratorRuntime.async(function _callee$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          sample = {
            contact: {
              FirstName: "RAP",
              LastName: "Par",
              Company: "Tree",
              Email: "abc",
              PhoneNumber: "1233214567"
            },
            invoice: {
              Date: Date.now(),
              Currency: "1",
              newitems: "['mobilw']",
              subtotal: "12.0",
              total: "100.0",
              billing_street: "Morbi",
              allowed_payment_modes: "['bank']",
              PhoneNumber: "1233214567"
            }
          };
          console.log(request.body);
          _context4.next = 4;
          return regeneratorRuntime.awrap(perfexCntrl.searchContactbyEmail(request.body.contact));

        case 4:
          res = _context4.sent;

          if (!res.hasOwnProperty("status")) {
            _context4.next = 9;
            break;
          }

          _context4.next = 8;
          return regeneratorRuntime.awrap(perfexCntrl.createContact(request.body.contact));

        case 8:
          newContact = _context4.sent;

        case 9:
          _context4.next = 11;
          return regeneratorRuntime.awrap(perfexCntrl.createInvoice(request.body));

        case 11:
          newInvoice = _context4.sent;
          response.send("thanks");

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  });
});
app.post("/test", function _callee2(request, response) {
  return regeneratorRuntime.async(function _callee2$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          console.log(request.body.sessionInfo.parameters);

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
});
app.post("/increase", function _callee3(request, response) {
  var json, id, inc;
  return regeneratorRuntime.async(function _callee3$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          json = {
            key: "hello"
          };
          console.log(request.body);
          console.log("test");
          id = request.body.id; // const decreased_stock = await decrease_stock(current_stock, id);

          _context6.next = 6;
          return regeneratorRuntime.awrap(increase_stock(id));

        case 6:
          inc = _context6.sent;
          // response.send({
          //   sku_id: id,
          //   increased_stock: increased_stock,
          // });
          //console.log(`id:${id} ,increased_stock: ${inc}`);
          response.status(200).json({
            status: "success",
            increased_stock: inc
          }); // response.send(json);

        case 8:
        case "end":
          return _context6.stop();
      }
    }
  });
});
app.post("/decrease", function _callee4(request, response) {
  var json, id, dec;
  return regeneratorRuntime.async(function _callee4$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          json = {
            key: "hello"
          };
          console.log(request.body);
          console.log("test");
          id = request.body.id;
          _context7.next = 6;
          return regeneratorRuntime.awrap(decrease_stock(id));

        case 6:
          dec = _context7.sent;
          console.log("Call to decrease for id ".concat(id)); //const increased_stock = await increase_stock(current_stock, id);
          //console.log("increased stock:", increased_stock);
          //console.log(`id:${id} ,decreased_stock: ${dec}`);

          response.status(200).json({
            status: "success",
            decreased_stock: dec
          }); // response.send(json);

        case 9:
        case "end":
          return _context7.stop();
      }
    }
  });
});
app.listen(port, function () {
  console.log("Listening on port ".concat(port));
});