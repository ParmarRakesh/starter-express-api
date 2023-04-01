//https://delightful-outfit-seal.cyclic.app

const express = require("express");
var axios = require("axios");
const https = require("https");
const { WebhookClient } = require("dialogflow-fulfillment");

const app = express();
// For parsing application/json
const perfexCntrl = require("./controller/perfexCntrl");

app.use(express.json());
const port = process.env.port || 5000;
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

async function sendtoCatelogue(products) {
  console.log(products.length);
  let data = "";
  for (let index = 0; index < products.length; index++) {
    const element = products[index];
    data =
      data +
      `${JSON.stringify({
        image: products[index].Images,
        ID: products[index].SKU,
        Price: products[index]["Regular price"],
        ItemName: products[index].Name,
        Tags: products[index].Tags,
      })}\r\n`;
  }
  var config = {
    method: "post",
    url: `${url}/api/1.1/obj/product/bulk`,
    headers: {
      Authorization: "Bearer 67d74dc4e8fc5a4ac2c649aca3cdbb1c",
      "Content-Type": "text/plain",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
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
// app.get("/product", async (request, response) => {
//   const json = {
//     key: "hello",
//   };
//   var axios = require("axios");
//   console.log(request.body);
//   console.log("test");
//   const id = request.body.id;
//   var config = {
//     method: "get",
//     //url: "https://sheetdb.io/api/v1/6syggp245ocxm/search?sheet=Sheet2&Regular price[]=<10&Regular price[]=>5&Stock=!=0",
//     url: "https://sheetdb.io/api/v1/ksc1cjo0smoj0",
//     headers: {},
//   };

//   axios(config)
//     .then(async function (res) {
//       console.log(res.data);
//       await sendtoCatelogue(res.data);

//       response.send(res.data);
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// });
app.post("/dialogflow", (request, response) => {
  console.log("testing");
  console.log(request.body);
  dialogflowfulfillment(request, response);
});

const dialogflowfulfillment = (request, response) => {
  if (!request.body.queryResult.fulfillmentMessages) return;
  request.body.queryResult.fulfillmentMessages =
    request.body.queryResult.fulfillmentMessages.map((m) => {
      if (!m.platform) m.platform = "PLATFORM_UNSPECIFIED";
      return m;
    });
  console.log(request.body.originalDetectIntentRequest.payload.userId);
  const _id = request.body.originalDetectIntentRequest.payload.userId;
  const agent = new WebhookClient({ request, response });
  //console.log("Dialogflow Request headers: " + JSON.stringify(request.headers));
  console.log(
    "Dialogflow Request body: " + JSON.stringify(request.body, "", 2)
  );

  var sender = {};
  var receiver = {};

  async function welcome(agent) {
    const result = await getRecipientSet(_id);
    console.log("in welcome intent recipient result");
    console.log(result);
    receiver.name = result["First Name"];
    receiver.set = result.Set;
    let budget = result.Budget;
    receiver.createdby = result["Created By"];
    sender = await getUser(receiver.createdby);
    console.log("sender", sender);

    agent.add(
      `Hi ${receiver.name}! I'm  ${sender["First name"]}'s personal gift assistant & I'll be assisting you today!`
    );
    agent.add(
      "Please take a minute to answer the questions to enable me to curate a personalized gift for you. 😊"
    );
    agent.add(
      "Kindly share your address? 🙂We only use this to ship your gifts. We do not sell your information."
    );
    //agent.add("  ");
    agent.context.set({
      name: "gender",
      lifespan: 25,
      parameters: {
        receiver_id: _id,
        sender: `${sender["First name"]}`,
        budget: budget,
      },
    });
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  async function coffeereview(agent) {
    await getNameFoodHobby("coffee");
    await delay(100000);
    agent.add(`coffee`);
  }

  async function teareview(agent) {
    await getNameFoodHobby("tea");
    await delay(100000);
    agent.add(`coffee`);
  }
  async function alcoholreview(agent) {
    await getNameFoodHobby("alcohol");
    await delay(100000);
    agent.add(`coffee`);
  }

  async function getNameFoodHobby(drink) {
    let query_context = "gender";
    let context = agent.contexts.find((item) => item.name === query_context);
    var Name = "";
    console.log("gender context", context);
    if (drink == "coffee") drink = context.parameters.brew1;
    else if (drink == "alcohol") drink = context.parameters.wineorshot;
    let budget = context.parameters.budget;
    var userQuery = {
      1: drink,
      2: context.parameters.food,
      3: context.parameters.hobby,
      4: "general",
    };
    var postPayload = {
      userQuery: userQuery,
      userConfig: { iteration_factor: 150 },
      update_model: "No",
    };

    // if (context.parameters.namelist.length != 0) {
    //   // console.log(context.parameters.namelist);
    //   Name = Name + " " + context.parameters.namelist;
    // }
    // if (context.parameters.person?.length != 0) {
    //   Name = Name + " " + context.parameters.person.name;
    // }
    // if (context.parameters?.["given-name"].length != 0) {
    //   Name = Name + " " + context.parameters["given-name"];
    // }
    // if (context.parameters?.["last-name"].length != 0) {
    //   Name = Name + " " + context.parameters["last-name"];
    // }
    // console.log(Name);

    // var set = await getRecipientSet(_id);
    //var budget = await getBudget(context.parameters.receiver_set);
    postPayload.budget = budget; //context.parameters.budget;
    try {
      var data = JSON.stringify(postPayload);
      console.log(data);
      var config2 = {
        method: "post",
        url: "http://35.213.172.93/userQueryInput",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config2)
        .then(async function (response) {
          console.log(JSON.stringify(response.data));
          await sendtoPopupAI(response.data, context.parameters);
          await sendtoRecepientX(
            response.data,
            context.parameters,
            userQuery[1]
          );
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (err) {
      // Handle Error Here
      console.error(err);
      agent.add("Error");
    }
  }

  async function getRecipientSet(_id) {
    var config = {
      method: "get",
      url: `${url}/api/1.1/obj/recipientx/${_id}`,
      headers: {},
    };
    try {
      const resp = await axios(config);
      console.log(resp.data);
      // const filterList = (list, searchValue) => {
      //   return list.filter((item) => item._id == _id);
      // };
      // var recepient1 = filterList(resp.data.response.results, _id);

      // return recepient1[0];
      return resp.data.response;
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  }

  async function getBudget(set) {
    var config = {
      method: "get",
      url: `${url}/api/1.1/obj/giftset`,
      headers: {},
    };
    try {
      const resp = await axios(config);
      console.log(resp.data);
      const giftset_id = resp.data.response.results.filter(
        (item) => item._id == set
      );
      console.log(giftset_id);
      var budget = giftset_id[0].budget.slice(2);

      return budget;
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  }

  async function sendtoPopupAI(ai, parameters) {
    let data;
    if (
      ai.status !=
      "Please try again and check MIN and MAX prices for more info."
    ) {
      data = `${JSON.stringify({
        image: ai[0].Images,
        sku: ai[0].SKU,
        total: ai[0].total,
        recipient_id: parameters.receiver_id,
        product_name: ai[0].Name,
      })}\r\n`;
      var data2 = JSON.stringify({
        id: ai[0].SKU,
      });

      var config2 = {
        method: "post",
        url: "https://delightful-outfit-seal.cyclic.app/decrease",
        headers: {
          "Content-Type": "application/json",
        },
        data: data2,
      };

      axios(config2)
        .then(function (response2) {
          console.log(JSON.stringify(response2.data));
        })
        .catch(function (error) {
          console.log(error);
        });
      await delay(2000);
      for (let index = 1; index < 4; index++) {
        const element = ai[index];
        data =
          data +
          `${JSON.stringify({
            image: ai[index].Images,
            sku: ai[index].SKU,
            total: ai[index].total,
            recipient_id: parameters.receiver_id,
            product_name: ai[index].Name,
          })}\r\n`;
        var data2 = JSON.stringify({
          id: ai[index].SKU,
        });

        var config2 = {
          method: "post",
          url: "https://delightful-outfit-seal.cyclic.app/decrease",
          headers: {
            "Content-Type": "application/json",
          },
          data: data2,
        };

        axios(config2)
          .then(function (response2) {
            console.log(JSON.stringify(response2.data));
          })
          .catch(function (error) {
            console.log(error);
          });
        await delay(2000);
      }
    } else {
      data = `${JSON.stringify({
        image: "No product found",
        sku: 0,
        total: 0,
        recipient_id: parameters.receiver_id,
        product_name: "No product found",
      })}\r\n`;
    }

    var config = {
      method: "post",
      url: `${url}/api/1.1/obj/popupai/bulk`,
      headers: {
        Authorization: "Bearer 67d74dc4e8fc5a4ac2c649aca3cdbb1c",
        "Content-Type": "text/plain",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function sendtoRecepientX(ai, parameters, drink) {
    var data;
    if (
      ai.status !=
      "Please try again and check MIN and MAX prices for more info."
    ) {
      data = JSON.stringify({
        status: "Ready",
        Review: parameters.notinnote,
        Address: parameters.location,
        Phone: parameters["phone-number"],
        Price: ai[0].total,
        drink: drink,
        food: parameters["food"],
        hobby: parameters["hobby"],
      });
    } else {
      data = JSON.stringify({
        status: "No Suggestion by AI",
        Review: parameters.notinnote,
        Address: parameters.location,
        Phone: parameters["phone-number"],
        Price: 0,
        drink: drink,
        food: parameters["food"],
        hobby: parameters["hobby"],
      });
    }

    var config = {
      method: "patch",
      url: `${url}/api/1.1/obj/RecipientX/${parameters.receiver_id}`,
      headers: {
        Authorization: "Bearer 67d74dc4e8fc5a4ac2c649aca3cdbb1c",
        "Content-Type": "application/json",
      },
      data: data,
    };

    console.log(config);
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function getUser(_id) {
    var config = {
      method: "get",
      url: `${url}/api/1.1/obj/user`,
      headers: {},
    };
    try {
      const resp = await axios(config);
      console.log(resp.data);
      const user = resp.data.response.results.filter((item) => item._id == _id);
      console.log(user);
      return user[0];
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  }
  async function checkAddress(agent) {
    let location = agent.parameters.location;
    let count = parseInt(agent.parameters.count);
    if (count != 1) var all_location = agent.parameters.all_location;
    var locations = [];
    locations.push(location);
    locations.push(all_location);
    console.log("------------------");
    console.log(agent.parameters);
    console.log("------------------");
    console.log("locations", locations);
    try {
      let validation = await validationAPI(locations);

      //check result if premise and missing is null then only show formatted address for confirmation.
      //else if result is not premise or missing is not null then ask for some more info
      // console.log(validation.result.verdict.hasOwnProperty(addressComplete));
      const toRemove = ["street_number", "route"];

      let missing = false;
      if (validation.result.address.hasOwnProperty("missingComponentTypes")) {
        const filteredComponent =
          validation.result.address.missingComponentTypes.filter(
            (comp) => !toRemove.includes(comp)
          );
        if (filteredComponent.length) {
          missing = true;
        }
      }
      if (count <= 2) {
        if (
          (validation.result.verdict.inputGranularity != "PREMISE" &&
            validation.result.verdict.inputGranularity != "SUB_PREMISE") ||
          missing
        ) {
          agent.add("dummy");
          agent.setFollowupEvent({
            name: `ask_location`,
            parameters: { count: `${count + 1}`, all_location: locations },
          });
        } else {
          agent.add("dummy");
          agent.setFollowupEvent({
            name: `confirm_address`,
            parameters: {
              fadd: `${validation.result.address.formattedAddress}`,
              count: `${count}`,
            },
          });
          //  agent.add("Perfect, what is the phone number?");
        }
      } else {
        agent.add("dummy");
        agent.setFollowupEvent({
          name: `get_any`,
          parameters: {
            fadd: `${validation.result.address.formattedAddress}`,
          },
        });
      }
    } catch (error) {
      agent.add("dummy");
      agent.setFollowupEvent({
        name: `get_any`,
      });
    }
  }

  async function validationAPI(location) {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({
        address: {
          addressLines: location,
        },
      });

      var config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://addressvalidation.googleapis.com/v1:validateAddress?key=AIzaSyDJE4z46NBCYEm1gGAghxC6ZEbqDUABEEA",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data, "", 2));
          resolve(response.data);
        })
        .catch(function (error) {
          console.log(error);
          reject(error);
        });
    });
  }
  async function askaddress(agent) {
    let count = parseInt(agent.parameters.count);
    if (count < 2) {
      agent.add("dummy");
      agent.setFollowupEvent({
        name: `ask_location`,
        parameters: { count: `${count + 1}` },
      });
    } else {
      agent.add("dummy");
      agent.setFollowupEvent({
        name: `get_any`,
      });
    }
  }

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  // intentMap.set('RhymingWord', rhymingWordHandler); //New
  intentMap.set("test", welcome);
  intentMap.set("coffeebye", coffeereview);
  intentMap.set("coffee2bye", coffeereview);
  intentMap.set("teabye", teareview);
  intentMap.set("alcoholbye", alcoholreview);
  intentMap.set("alcoholskip", alcoholreview);
  intentMap.set("coffee2skip", coffeereview);
  intentMap.set("coffeeskip", coffeereview);
  intentMap.set("teaskip", teareview);
  intentMap.set("phone", checkAddress);
  intentMap.set("ask correct location", checkAddress);
  intentMap.set("addressConfirmation - no", askaddress);

  agent.handleRequest(intentMap);
};

app.post("/faq-dialogflow", (request, response) => {
  //  console.log(JSON.stringify(request.body, "", 2));
  let status = "by default";
  let intentName = request.body.queryResult.intent.displayName;
  let response1;
  switch (intentName) {
    case "Check Order Status":
      console.log(request.body.queryResult);

      let email = request.body.queryResult.parameters.billing_email;
      const res = checkstatus(email);

      break;
    default:
      break;
  }

  async function checkstatus(email) {
    try {
      const response = await WooCommerce.get(`orders/?search=${email}`);
      console.log("checking order status...");

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data);
    }

    response1 = {
      fulfillment_messages: [
        {
          text: {
            text: [`we got order`],
          },
        },
        {
          payload: {
            richContent: [
              [
                {
                  type: "chips",
                  options: [
                    {
                      text: "Yes",
                    },
                    {
                      text: "No",
                    },
                  ],
                },
              ],
            ],
          },
        },
      ],
    };
    response.json(response1);
  }
});
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
