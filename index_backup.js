const express = require("express");
var axios = require("axios");
const https = require("https");

const app = express();
// For parsing application/json
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
app.get("/data", async (req, res) => {
  console.log("Just got a request!");
  const data = await sendGetRequest();
  res.send(data);
});

async function get_stock(product_id) {
  return new Promise((resolve, reject) => {
    var config = {
      method: "get",
      url: `https://alittlething.co/wp-json/wc/v3/products/${product_id}`,
      headers: {
        Authorization:
          "Basic Y2tfYjc2MjZmYWJhM2MzYTFkNWU0ZjMyYmNhMmQ5NGFjMTM1NWUzMjE1Mjpjc18yNGM0ZGU5ZDU1Y2Y0ZjExYTRiMmU3MWQ1NGVlOTJhMGE0MGExNzFm",
        Cookie:
          "PHPSESSID=ctdi4iuc2l05sqekepdm5cipqo; mailchimp_landing_site=https%3A%2F%2Falittlething.co%2Fwp-json%2Fwc%2Fv3%2Fproducts%2F20223; wfwaf-authcookie-65e717bb942274366e37ef93fe37e38d=827%7Cadministrator%7Cmanage_options%2Cunfiltered_html%2Cedit_others_posts%2Cupload_files%2Cpublish_posts%2Cedit_posts%2Cread%7Cd9099ef84dfa79b02b3d4953d5f9efab172e42b38fb73604655b25930e51fbee",
      },
    };

    axios(config)
      .then(async function (res) {
        console.log(
          `ID:${product_id}, Current Quantity:${res.data.stock_quantity}`
        );
        resolve(res.data.stock_quantity);
      })
      .catch(function (error) {
        console.log(error);
      });
  });
}

const sendGetRequest = async () => {
  try {
    var config = {
      method: "get",
      url: `https://alittlething.co/wp-json/wc/v3/products/17331`,
      headers: {
        Authorization:
          "Basic Y2tfYjc2MjZmYWJhM2MzYTFkNWU0ZjMyYmNhMmQ5NGFjMTM1NWUzMjE1Mjpjc18yNGM0ZGU5ZDU1Y2Y0ZjExYTRiMmU3MWQ1NGVlOTJhMGE0MGExNzFm",
        Cookie:
          "PHPSESSID=ctdi4iuc2l05sqekepdm5cipqo; mailchimp_landing_site=https%3A%2F%2Falittlething.co%2Fwp-json%2Fwc%2Fv3%2Fproducts%2F20223; wfwaf-authcookie-65e717bb942274366e37ef93fe37e38d=827%7Cadministrator%7Cmanage_options%2Cunfiltered_html%2Cedit_others_posts%2Cupload_files%2Cpublish_posts%2Cedit_posts%2Cread%7Cd9099ef84dfa79b02b3d4953d5f9efab172e42b38fb73604655b25930e51fbee",
      },
    };

    const resp = await axios(config);

    console.log(resp.data);
    return resp.data;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

async function decrease_stock_promise(product_id) {
  return new Promise(async (resolve, reject) => {
    let current_stock = await get_stock(product_id);
    current_stock = current_stock - 1;
    var data = JSON.stringify({
      stock_quantity: current_stock,
    });

    var config = {
      method: "put",
      url: `https://alittlething.co/wp-json/wc/v3/products/${product_id}`,
      headers: {
        Authorization:
          "Basic Y2tfYjc2MjZmYWJhM2MzYTFkNWU0ZjMyYmNhMmQ5NGFjMTM1NWUzMjE1Mjpjc18yNGM0ZGU5ZDU1Y2Y0ZjExYTRiMmU3MWQ1NGVlOTJhMGE0MGExNzFm",
        "Content-Type": "application/json",
        Cookie:
          "PHPSESSID=ctdi4iuc2l05sqekepdm5cipqo; mailchimp_landing_site=https%3A%2F%2Falittlething.co%2Fwp-json%2Fwc%2Fv3%2Fproducts%2F20186; wfwaf-authcookie-65e717bb942274366e37ef93fe37e38d=827%7Cadministrator%7Cmanage_options%2Cunfiltered_html%2Cedit_others_posts%2Cupload_files%2Cpublish_posts%2Cedit_posts%2Cread%7C7f126310333728ebad0db9da48b967fded175b927eabb592c4f3bc8d7e2d2ab3",
      },

      data: data,
    };

    axios(config)
      .then(function (response) {
        //console.log(response.data);
        resolve(response.data.stock_quantity);
      })
      .catch(function (error) {
        console.log(error);
      });
  });
}

async function increase_stock_promise(product_id) {
  return new Promise(async (resolve, reject) => {
    let current_stock = await get_stock(product_id);
    current_stock = current_stock + 1;
    var data = JSON.stringify({
      stock_quantity: current_stock,
    });

    var config = {
      method: "put",
      url: `https://alittlething.co/wp-json/wc/v3/products/${product_id}`,
      headers: {
        Authorization:
          "Basic Y2tfYjc2MjZmYWJhM2MzYTFkNWU0ZjMyYmNhMmQ5NGFjMTM1NWUzMjE1Mjpjc18yNGM0ZGU5ZDU1Y2Y0ZjExYTRiMmU3MWQ1NGVlOTJhMGE0MGExNzFm",
        "Content-Type": "application/json",
        Cookie:
          "PHPSESSID=ctdi4iuc2l05sqekepdm5cipqo; mailchimp_landing_site=https%3A%2F%2Falittlething.co%2Fwp-json%2Fwc%2Fv3%2Fproducts%2F20186; wfwaf-authcookie-65e717bb942274366e37ef93fe37e38d=827%7Cadministrator%7Cmanage_options%2Cunfiltered_html%2Cedit_others_posts%2Cupload_files%2Cpublish_posts%2Cedit_posts%2Cread%7C7f126310333728ebad0db9da48b967fded175b927eabb592c4f3bc8d7e2d2ab3",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data.stock_quantity);
        resolve(response.data.stock_quantity);
      })
      .catch(function (error) {
        console.log(error);
      });
  });
}

async function decrease_stock(product_id) {
  try {
    let current_stock = await get_stock(product_id);
    current_stock = current_stock - 1;
    var data = JSON.stringify({
      stock_quantity: current_stock,
    });

    var config = {
      method: "put",
      url: `https://alittlething.co/wp-json/wc/v3/products/${product_id}`,
      headers: {
        Authorization:
          "Basic Y2tfYjc2MjZmYWJhM2MzYTFkNWU0ZjMyYmNhMmQ5NGFjMTM1NWUzMjE1Mjpjc18yNGM0ZGU5ZDU1Y2Y0ZjExYTRiMmU3MWQ1NGVlOTJhMGE0MGExNzFm",
        "Content-Type": "application/json",
        Cookie:
          "PHPSESSID=ctdi4iuc2l05sqekepdm5cipqo; mailchimp_landing_site=https%3A%2F%2Falittlething.co%2Fwp-json%2Fwc%2Fv3%2Fproducts%2F20186; wfwaf-authcookie-65e717bb942274366e37ef93fe37e38d=827%7Cadministrator%7Cmanage_options%2Cunfiltered_html%2Cedit_others_posts%2Cupload_files%2Cpublish_posts%2Cedit_posts%2Cread%7C7f126310333728ebad0db9da48b967fded175b927eabb592c4f3bc8d7e2d2ab3",
      },
      httpsAgent: new https.Agent({ keepAlive: true }),
      data: data,
    };

    const update_quantity = await axios(config);
    console.log(`
        sku_id: ${product_id},
        decreased_stock: ${update_quantity.data.stock_quantity},
       `);
    return update_quantity.data.stock_quantity;
  } catch (error) {
    console.log(error);
  }
}

async function increase_stock(product_id) {
  try {
    let current_stock = await get_stock(product_id);
    current_stock = current_stock + 1;
    var data = JSON.stringify({
      stock_quantity: current_stock,
    });

    var config = {
      method: "put",
      url: `https://alittlething.co/wp-json/wc/v3/products/${product_id}`,
      headers: {
        Authorization:
          "Basic Y2tfYjc2MjZmYWJhM2MzYTFkNWU0ZjMyYmNhMmQ5NGFjMTM1NWUzMjE1Mjpjc18yNGM0ZGU5ZDU1Y2Y0ZjExYTRiMmU3MWQ1NGVlOTJhMGE0MGExNzFm",
        "Content-Type": "application/json",
        Cookie:
          "PHPSESSID=ctdi4iuc2l05sqekepdm5cipqo; mailchimp_landing_site=https%3A%2F%2Falittlething.co%2Fwp-json%2Fwc%2Fv3%2Fproducts%2F20186; wfwaf-authcookie-65e717bb942274366e37ef93fe37e38d=827%7Cadministrator%7Cmanage_options%2Cunfiltered_html%2Cedit_others_posts%2Cupload_files%2Cpublish_posts%2Cedit_posts%2Cread%7C7f126310333728ebad0db9da48b967fded175b927eabb592c4f3bc8d7e2d2ab3",
      },
      httpsAgent: new https.Agent({ keepAlive: true }),
      data: data,
    };

    const update_quantity = await axios(config);
    console.log(`
        sku_id: ${product_id},
        increased_stock: ${update_quantity.data.stock_quantity},
       `);
    return update_quantity.data.stock_quantity;
  } catch (error) {
    console.log(error);
  }
}

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

app.post("/in", async (req, res) => {
  const product_id = req.body.id;
  var config = {
    method: "get",
    url: `https://alittlething.co/wp-json/wc/v3/products/${product_id}`,
    headers: {
      Authorization:
        "Basic Y2tfYjc2MjZmYWJhM2MzYTFkNWU0ZjMyYmNhMmQ5NGFjMTM1NWUzMjE1Mjpjc18yNGM0ZGU5ZDU1Y2Y0ZjExYTRiMmU3MWQ1NGVlOTJhMGE0MGExNzFm",
      Cookie:
        "PHPSESSID=ctdi4iuc2l05sqekepdm5cipqo; mailchimp_landing_site=https%3A%2F%2Falittlething.co%2Fwp-json%2Fwc%2Fv3%2Fproducts%2F20223; wfwaf-authcookie-65e717bb942274366e37ef93fe37e38d=827%7Cadministrator%7Cmanage_options%2Cunfiltered_html%2Cedit_others_posts%2Cupload_files%2Cpublish_posts%2Cedit_posts%2Cread%7Cd9099ef84dfa79b02b3d4953d5f9efab172e42b38fb73604655b25930e51fbee",
    },
  };

  axios(config)
    .then(function (resp) {
      console.log(
        `ID:${product_id}, Current Quantity:${resp.data.stock_quantity}`
      );

      let current_stock = resp.data.stock_quantity + 1;
      var data = JSON.stringify({
        stock_quantity: current_stock,
      });

      var config = {
        method: "put",
        url: `https://alittlething.co/wp-json/wc/v3/products/${product_id}`,
        headers: {
          Authorization:
            "Basic Y2tfYjc2MjZmYWJhM2MzYTFkNWU0ZjMyYmNhMmQ5NGFjMTM1NWUzMjE1Mjpjc18yNGM0ZGU5ZDU1Y2Y0ZjExYTRiMmU3MWQ1NGVlOTJhMGE0MGExNzFm",
          "Content-Type": "application/json",
          Cookie:
            "PHPSESSID=ctdi4iuc2l05sqekepdm5cipqo; mailchimp_landing_site=https%3A%2F%2Falittlething.co%2Fwp-json%2Fwc%2Fv3%2Fproducts%2F20186; wfwaf-authcookie-65e717bb942274366e37ef93fe37e38d=827%7Cadministrator%7Cmanage_options%2Cunfiltered_html%2Cedit_others_posts%2Cupload_files%2Cpublish_posts%2Cedit_posts%2Cread%7C7f126310333728ebad0db9da48b967fded175b927eabb592c4f3bc8d7e2d2ab3",
        },
        httpsAgent: new https.Agent({ keepAlive: true }),
        data: data,
      };

      axios(config)
        .then(function (response) {
          console.log(`
               sku_id: ${product_id},
            decreased_stock: ${response.data.stock_quantity},
                  `);
          response.data.stock_quantity;
          return res.status(200).json({
            status: "success",
            decreased_stock: response.data.stock_quantity,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });

  // const dec = await increase_stock(id);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
