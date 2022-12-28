const express = require("express");
var axios = require("axios");
const https = require("https");

const app = express();
// For parsing application/json
const perfexCntrl = require("./controller/perfexCntrl");

app.use(express.json());
const port = process.env.port || 3000;
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
// import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; // Supports ESM

const WooCommerce = new WooCommerceRestApi({
  url: "https://alittlething.co",
  consumerKey: "ck_b7626faba3c3a1d5e4f32bca2d94ac1355e32152",
  consumerSecret: "cs_24c4de9d55cf4f11a4b2e71d54ee92a0a40a171f",
  version: "wc/v3",
});

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  console.log("Just got a request!");
  res.send("Yo! Hello");
});

async function get_stock(product_id) {
  try {
    const response = await WooCommerce.get(`products/${product_id}`);

    console.log(response.data.stock_quantity);
    return response.data.stock_quantity;
  } catch (error) {
    console.log(error.response.data);
  }
}

async function decrease_stock(product_id) {
  try {
    let current_stock = await get_stock(product_id);
    console.log(typeof current_stock);
    console.log(`current_stock:${current_stock}`);
    current_stock = current_stock - 1;
    const data = {
      stock_quantity: current_stock,
    };
    console.log("current_stock", current_stock);

    const response1 = await WooCommerce.put(`products/${product_id}`, data);
    console.log(`
        sku_id: ${product_id},
        decreased_stock: ${response1.data.stock_quantity},
       `);
    return response1.data.stock_quantity;
  } catch (error) {
    console.log(error.response.data);
  }
}

async function increase_stock(product_id) {
  try {
    let current_stock = await get_stock(product_id);
    console.log(typeof current_stock);
    console.log(`current_stock:${current_stock}`);
    current_stock = current_stock + 1;
    const data = {
      stock_quantity: current_stock,
    };
    console.log("current_stock", current_stock);

    const response1 = await WooCommerce.put(`products/${product_id}`, data);
    console.log(`
        sku_id: ${product_id},
        decreased_stock: ${response1.data.stock_quantity},
       `);
    return response1.data.stock_quantity;
  } catch (error) {
    console.log(error.response.data);
  }
}
app.post("/route", async (request, response) => {
  var sample = {
    contact: {
      FirstName: "RAP",
      LastName: "Par",
      Company: "Tree",
      Email: "abc",
      PhoneNumber: "1233214567",
    },
    invoice: {
      Date: Date.now(),
      Currency: "1",
      newitems: "['mobilw']",
      subtotal: "12.0",
      total: "100.0",
      billing_street: "Morbi",
      allowed_payment_modes: "['bank']",
      PhoneNumber: "1233214567",
    },
  };
  console.log(request.body);
  const res = await perfexCntrl.searchContactbyEmail(request.body.contact);
  if (res.hasOwnProperty("status")) {
    const newContact = await perfexCntrl.createContact(request.body.contact);
  }
  const newInvoice = await perfexCntrl.createInvoice(request.body);
  response.status(200).json(newInvoice);
});
app.post("/test", async (request, response) => {
  console.log(JSON.stringify(request.body, "", 2));
});
app.post("/increase", async (request, response) => {
  const json = {
    key: "hello",
  };
  console.log(request.body);
  console.log("test");
  const id = request.body.id;
  // const decreased_stock = await decrease_stock(current_stock, id);
  const inc = await increase_stock(id);
  // response.send({
  //   sku_id: id,
  //   increased_stock: increased_stock,
  // });
  //console.log(`id:${id} ,increased_stock: ${inc}`);
  response.status(200).json({ status: "success", increased_stock: inc });

  // response.send(json);
});
app.post("/decrease", async (request, response) => {
  const json = {
    key: "hello",
  };
  console.log(request.body);
  console.log("test");
  const id = request.body.id;
  const dec = await decrease_stock(id);
  console.log(`Call to decrease for id ${id}`);
  //const increased_stock = await increase_stock(current_stock, id);
  //console.log("increased stock:", increased_stock);
  //console.log(`id:${id} ,decreased_stock: ${dec}`);

  response.status(200).json({ status: "success", decreased_stock: dec });
  // response.send(json);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
