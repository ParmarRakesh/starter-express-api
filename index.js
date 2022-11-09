const express = require("express");
var axios = require("axios");

const app = express();
app.get("/", (req, res) => {
  console.log("Just got a request!");
  res.send("Yo! Hello");
});

app.post("/product", async (request, response) => {
  const json = {
    key: "hello",
  };
  console.log(request);
  console.log("test");
  const id = request.body.id;

  var config = {
    method: "get",
    url: `https://alittlething.co/wp-json/wc/v3/products/${id}`,
    headers: {
      Authorization:
        "Basic Y2tfYjc2MjZmYWJhM2MzYTFkNWU0ZjMyYmNhMmQ5NGFjMTM1NWUzMjE1Mjpjc18yNGM0ZGU5ZDU1Y2Y0ZjExYTRiMmU3MWQ1NGVlOTJhMGE0MGExNzFm",
      Cookie:
        "PHPSESSID=ctdi4iuc2l05sqekepdm5cipqo; mailchimp_landing_site=https%3A%2F%2Falittlething.co%2Fwp-json%2Fwc%2Fv3%2Fproducts%2F20223; wfwaf-authcookie-65e717bb942274366e37ef93fe37e38d=827%7Cadministrator%7Cmanage_options%2Cunfiltered_html%2Cedit_others_posts%2Cupload_files%2Cpublish_posts%2Cedit_posts%2Cread%7Cd9099ef84dfa79b02b3d4953d5f9efab172e42b38fb73604655b25930e51fbee",
    },
  };

  axios(config)
    .then(async function (res) {
      console.log(res.data.stock_quantity);
      const ret = await decrease_stock(res.data.stock_quantity, id);
      console.log("ret", ret);

      response.send(res.data);
    })
    .catch(function (error) {
      console.log(error);
    });

  // response.send(json);
});

async function decrease_stock(stock, product_id) {
  stock = stock - 1;
  var data = JSON.stringify({
    stock_quantity: stock,
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
      console.log(response.data);
      return 1;
    })
    .catch(function (error) {
      console.log(error);
    });
}
app.listen(process.env.PORT || 3000);
