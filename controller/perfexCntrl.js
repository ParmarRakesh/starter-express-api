var axios = require("axios");
var configenv = require("../config");
var FormData = require("form-data");
const https = require("https");
const { json } = require("express");

axios.create({
  httpsAgent: new https.Agent({ keepAlive: true }),
});
// Methods to be executed on routes
const searchContactbyEmail = async (data) => {
  console.log("Calling SearchContactbyEmail");
  var config = {
    method: "get",
    url: `https://portal.alittlething.co/api/contacts/search/${data.email}`,
    headers: {
      authtoken: configenv.authtoken,
      Authorization: "Bearer " + configenv.authtoken,
      Cookie: configenv.cookie,
    },
  };

  try {
    let response = await axios(config);
    console.log("ContactSearchByEmail:");
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      return error.response.data;
    }
  }
};

const searchInvoicebyPhone = async (data) => {
  console.log("Calling searchInvoicebyPhone");
  var config = {
    method: "get",
    url: `https://portal.alittlething.co/api/invoices/search/${data.phonenumber}`,
    headers: {
      authtoken: configenv.authtoken,
      Authorization: "Bearer " + configenv.authtoken,
      Cookie: configenv.cookie,
    },
  };

  try {
    let response = await axios(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      return error.response.data;
    }
  }
};

const createInvoice = async (invoiceData) => {
  var data = new FormData();
  console.log("Calling createInvoice");
  //Get clientId by searching customer by name and phone
  let customerData = await searchCustomerbyName(invoiceData.contact.company);
  console.log("customerData1");
  console.log(customerData);
  customerData = customerData.find(
    (item) => item.phonenumber == `${invoiceData.contact.phonenumber}`
  );
  customer_id = customerData.userid;
  console.log("customerData After find");
  console.log(customerData);
  //To get next invoice number, search invoices if not found then start by one otherwise get the latest maximum
  //invoice number
  //const invoicesearch = await searchInvoicebyPhone(customerData);
  const allInvoices = await getAllinvoice();
  var maxInvoicenumber;
  // if (!invoicesearch.hasOwnProperty("status")) {
  //   maxInvoicenumber = Math.max.apply(
  //     Math,
  //     invoice.map(function (o) {
  //       return o.number;
  //     })
  //   );
  // }
  maxInvoicenumber = maxInvoicenumber = Math.max.apply(
    Math,
    allInvoices.map(function (o) {
      return o.number;
    })
  );
  var invoicenumber = maxInvoicenumber + 1;
  console.log("invoicenumber generated", invoicenumber);

  data.append("clientid", `${customer_id}`);
  data.append("number", `${invoicenumber}`);
  data.append("date", `${invoiceData.invoice.date}`);
  data.append("currency", `${invoiceData.invoice.currency}`);
  data.append("newitems", `${invoiceData.invoice.newitems}`);
  data.append("subtotal", `${invoiceData.invoice.subtotal}`);
  data.append("total", `${invoiceData.invoice.total}`);
  data.append("billing_street", `${invoiceData.invoice.billing_street}`);
  data.append(
    "allowed_payment_modes",
    `${invoiceData.invoice.allowed_payment_modes}`
  );

  var config = {
    method: "post",
    url: "https://portal.alittlething.co/api/invoices",
    headers: {
      authtoken: configenv.authtoken,
      Authorization: "Bearer " + configenv.authtoken,
      Cookie: configenv.cookie,
      ...data.getHeaders(),
    },
    data: data,
  };
  console.log("Invoice Details");
  console.log(JSON.stringify(config, "", 2));

  try {
    let response = await axios(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.log(error.response);
  }
};

const createContact = async (contact) => {
  var data = new FormData();
  console.log("Calling createContact");
  //create customer ang then search customer based on name and phone number and get customer_id
  const customer = await createCustomer(contact);
  let customerData = await searchCustomerbyName(contact.company);
  customerData = customerData.find(
    (item) => item.phonenumber == `${contact.phonenumber}`
  );
  customer_id = customerData.userid;
  console.log(customer_id);

  data.append("customer_id", `${customer_id}`);
  data.append("firstname", `${contact.firstname}`);
  data.append("lastname", `${contact.lastname}`);
  data.append("email", `${contact.email}`);
  data.append("password", "123123");
  data.append("phonenumber", `${contact.phonenumber}`);
  var config = {
    method: "post",
    url: "https://portal.alittlething.co/api/contacts",
    headers: {
      authtoken: configenv.authtoken,
      Authorization: "Bearer " + configenv.authtoken,
      Cookie: configenv.cookie,
      ...data.getHeaders(),
    },
    data: data,
  };
  console.log(JSON.stringify(config));

  try {
    let response = await axios(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
const createCustomer = async (customer) => {
  var data = new FormData();
  console.log("Calling createCustomer");
  data.append("company", `${customer.company}`);
  data.append("phonenumber", `${customer.phonenumber}`);
  var config = {
    method: "post",
    url: "https://portal.alittlething.co/api/customers",
    headers: {
      authtoken: configenv.authtoken,
      Authorization: "Bearer " + configenv.authtoken,
      Cookie: configenv.cookie,
      ...data.getHeaders(),
    },
    data: data,
  };

  try {
    let response = await axios(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const searchCustomerbyName = async (customerName) => {
  console.log("Calling searchCustomerbyName");
  var config = {
    method: "get",
    url: `https://portal.alittlething.co/api/customers/search/${customerName}`,
    headers: {
      authtoken: configenv.authtoken,
      Authorization: "Bearer " + configenv.authtoken,
      Cookie: configenv.cookie,
    },
  };

  try {
    let response = await axios(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      return error.response.data;
    }
  }
};

const getAllinvoice = async () => {
  console.log("Calling getInvoices");
  var config = {
    method: "get",
    url: `https://portal.alittlething.co/api/invoices/`,
    headers: {
      authtoken: configenv.authtoken,
      Authorization: "Bearer " + configenv.authtoken,
      Cookie: configenv.cookie,
    },
  };

  try {
    let response = await axios(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      return error.response.data;
    }
  }
};

// Export of all methods as object
module.exports = {
  searchContactbyEmail,
  searchInvoicebyPhone,
  createInvoice,
  createContact,
};
