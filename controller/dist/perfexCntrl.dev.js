"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var axios = require("axios");

var configenv = require("../config");

var FormData = require("form-data");

var https = require("https");

var _require = require("express"),
    json = _require.json;

axios.create({
  httpsAgent: new https.Agent({
    keepAlive: true
  })
}); // Methods to be executed on routes

var searchContactbyEmail = function searchContactbyEmail(data) {
  var config, response;
  return regeneratorRuntime.async(function searchContactbyEmail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("Calling SearchContactbyEmail");
          config = {
            method: "get",
            url: "https://portal.alittlething.co/api/contacts/search/".concat(data.email),
            headers: {
              authtoken: configenv.authtoken,
              Authorization: "Bearer " + configenv.authtoken,
              Cookie: configenv.cookie
            }
          };
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(axios(config));

        case 5:
          response = _context.sent;
          console.log("ContactSearchByEmail:"); // console.log(JSON.stringify(response.data));

          return _context.abrupt("return", response.data);

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](2);

          if (!_context.t0.response) {
            _context.next = 14;
            break;
          }

          return _context.abrupt("return", _context.t0.response.data);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 10]]);
};

var searchInvoicebyPhone = function searchInvoicebyPhone(data) {
  var config, response;
  return regeneratorRuntime.async(function searchInvoicebyPhone$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log("Calling searchInvoicebyPhone");
          config = {
            method: "get",
            url: "https://portal.alittlething.co/api/invoices/search/".concat(data.phonenumber),
            headers: {
              authtoken: configenv.authtoken,
              Authorization: "Bearer " + configenv.authtoken,
              Cookie: configenv.cookie
            }
          };
          _context2.prev = 2;
          _context2.next = 5;
          return regeneratorRuntime.awrap(axios(config));

        case 5:
          response = _context2.sent;
          return _context2.abrupt("return", response.data);

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](2);

          if (!_context2.t0.response) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt("return", _context2.t0.response.data);

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 9]]);
};

var createInvoice = function createInvoice(invoiceData) {
  var data, customerData, allInvoices, maxInvoicenumber, invoicenumber, config, response;
  return regeneratorRuntime.async(function createInvoice$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          data = new FormData();
          console.log("Calling createInvoice"); //Get clientId by searching customer by name and phone

          _context3.next = 4;
          return regeneratorRuntime.awrap(searchCustomerbyName(invoiceData.contact.company));

        case 4:
          customerData = _context3.sent;
          console.log("customerData1"); // console.log(customerData);

          customerData = customerData.find(function (item) {
            return item.phonenumber == "".concat(invoiceData.contact.phonenumber);
          });
          customer_id = customerData.userid;
          console.log("customerData After find"); //  console.log(customerData);
          //To get next invoice number, search invoices if not found then start by one otherwise get the latest maximum
          //invoice number
          //const invoicesearch = await searchInvoicebyPhone(customerData);

          _context3.next = 11;
          return regeneratorRuntime.awrap(getAllinvoice());

        case 11:
          allInvoices = _context3.sent;
          // if (!invoicesearch.hasOwnProperty("status")) {
          //   maxInvoicenumber = Math.max.apply(
          //     Math,
          //     invoice.map(function (o) {
          //       return o.number;
          //     })
          //   );
          // }
          maxInvoicenumber = maxInvoicenumber = Math.max.apply(Math, allInvoices.map(function (o) {
            return o.number;
          }));
          invoicenumber = maxInvoicenumber + 1;
          console.log("invoicenumber generated", invoicenumber);
          data.append("clientid", "".concat(customer_id));
          data.append("number", "".concat(invoicenumber));
          data.append("date", "".concat(invoiceData.invoice.date));
          data.append("currency", "".concat(invoiceData.invoice.currency));
          data.append("newitems", "".concat(invoiceData.invoice.newitems));
          data.append("subtotal", "".concat(invoiceData.invoice.subtotal));
          data.append("total", "".concat(invoiceData.invoice.total));
          data.append("billing_street", "".concat(invoiceData.invoice.billing_street));
          data.append("allowed_payment_modes", "".concat(invoiceData.invoice.allowed_payment_modes));
          config = {
            method: "post",
            url: "https://portal.alittlething.co/api/invoices",
            headers: _objectSpread({
              authtoken: configenv.authtoken,
              Authorization: "Bearer " + configenv.authtoken,
              Cookie: configenv.cookie
            }, data.getHeaders()),
            data: data
          };
          console.log("Invoice Details"); //console.log(JSON.stringify(config, "", 2));

          _context3.prev = 26;
          _context3.next = 29;
          return regeneratorRuntime.awrap(axios(config));

        case 29:
          response = _context3.sent;
          return _context3.abrupt("return", response.data);

        case 33:
          _context3.prev = 33;
          _context3.t0 = _context3["catch"](26);

        case 35:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[26, 33]]);
};

var createContact = function createContact(contact) {
  var data, customer, customerData, config, response;
  return regeneratorRuntime.async(function createContact$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          data = new FormData();
          console.log("Calling createContact"); //create customer ang then search customer based on name and phone number and get customer_id

          _context4.next = 4;
          return regeneratorRuntime.awrap(createCustomer(contact));

        case 4:
          customer = _context4.sent;
          _context4.next = 7;
          return regeneratorRuntime.awrap(searchCustomerbyName(contact.company));

        case 7:
          customerData = _context4.sent;
          customerData = customerData.find(function (item) {
            return item.phonenumber == "".concat(contact.phonenumber);
          });
          customer_id = customerData.userid;
          console.log(customer_id);
          data.append("customer_id", "".concat(customer_id));
          data.append("firstname", "".concat(contact.firstname));
          data.append("lastname", "".concat(contact.lastname));
          data.append("email", "".concat(contact.email));
          data.append("password", "123123");
          data.append("phonenumber", "".concat(contact.phonenumber));
          config = {
            method: "post",
            url: "https://portal.alittlething.co/api/contacts",
            headers: _objectSpread({
              authtoken: configenv.authtoken,
              Authorization: "Bearer " + configenv.authtoken,
              Cookie: configenv.cookie
            }, data.getHeaders()),
            data: data
          };
          console.log(JSON.stringify(config));
          _context4.prev = 19;
          _context4.next = 22;
          return regeneratorRuntime.awrap(axios(config));

        case 22:
          response = _context4.sent;
          return _context4.abrupt("return", response.data);

        case 26:
          _context4.prev = 26;
          _context4.t0 = _context4["catch"](19);
          console.log(_context4.t0);

        case 29:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[19, 26]]);
};

var createCustomer = function createCustomer(customer) {
  var data, config, response;
  return regeneratorRuntime.async(function createCustomer$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          data = new FormData();
          console.log("Calling createCustomer");
          data.append("company", "".concat(customer.company));
          data.append("phonenumber", "".concat(customer.phonenumber));
          config = {
            method: "post",
            url: "https://portal.alittlething.co/api/customers",
            headers: _objectSpread({
              authtoken: configenv.authtoken,
              Authorization: "Bearer " + configenv.authtoken,
              Cookie: configenv.cookie
            }, data.getHeaders()),
            data: data
          };
          _context5.prev = 5;
          _context5.next = 8;
          return regeneratorRuntime.awrap(axios(config));

        case 8:
          response = _context5.sent;
          return _context5.abrupt("return", response.data);

        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](5);
          console.log(_context5.t0);

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[5, 12]]);
};

var searchCustomerbyName = function searchCustomerbyName(customerName) {
  var config, response;
  return regeneratorRuntime.async(function searchCustomerbyName$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          console.log("Calling searchCustomerbyName");
          config = {
            method: "get",
            url: "https://portal.alittlething.co/api/customers/search/".concat(customerName),
            headers: {
              authtoken: configenv.authtoken,
              Authorization: "Bearer " + configenv.authtoken,
              Cookie: configenv.cookie
            }
          };
          _context6.prev = 2;
          _context6.next = 5;
          return regeneratorRuntime.awrap(axios(config));

        case 5:
          response = _context6.sent;
          return _context6.abrupt("return", response.data);

        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](2);

          if (!_context6.t0.response) {
            _context6.next = 14;
            break;
          }

          console.log(_context6.t0.response.data);
          return _context6.abrupt("return", _context6.t0.response.data);

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[2, 9]]);
};

var getAllinvoice = function getAllinvoice() {
  var config, response;
  return regeneratorRuntime.async(function getAllinvoice$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          console.log("Calling getInvoices");
          config = {
            method: "get",
            url: "https://portal.alittlething.co/api/invoices/",
            headers: {
              authtoken: configenv.authtoken,
              Authorization: "Bearer " + configenv.authtoken,
              Cookie: configenv.cookie
            }
          };
          _context7.prev = 2;
          _context7.next = 5;
          return regeneratorRuntime.awrap(axios(config));

        case 5:
          response = _context7.sent;
          return _context7.abrupt("return", response.data);

        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](2);

          if (!_context7.t0.response) {
            _context7.next = 14;
            break;
          }

          console.log(_context7.t0.response.data);
          return _context7.abrupt("return", _context7.t0.response.data);

        case 14:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[2, 9]]);
}; // Export of all methods as object


module.exports = {
  searchContactbyEmail: searchContactbyEmail,
  searchInvoicebyPhone: searchInvoicebyPhone,
  createInvoice: createInvoice,
  createContact: createContact
};