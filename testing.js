const request = require("request");
var configenv = require("./config");

const options = {
  method: "POST",
  url: "https://portal.alittlething.co/api/invoices",
  headers: {
    authtoken: configenv.authtoken,
    Authorization: "Bearer " + configenv.authtoken,
    Cookie: configenv.cookie,
  },
  body: {
    clientid: 90,
    date: "2022-12-28",
    duedate: "2022-12-31",
    status: "unpaid",
    subtotal: 500.0,
    total: 550.0,
    total_tax: 50.0,
    items: [
      {
        description: "Widget",
        qty: 10,
        rate: 50.0,
        taxname: "Sales Tax",
      },
    ],
  },
  json: true,
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
