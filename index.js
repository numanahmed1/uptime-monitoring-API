/*
 * Title: Uptime monitoring API
 * Description: A RESTful API to monitor up or down time of user defined links
 * Author: Numan Ahmed
 * Date: 29-06-2021
 */

// dependencies
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environment = require("./helpers/environment");
const data = require("./lib/data");
const { sendTwilioSMS } = require("./helpers/notification");

// app object module scaffolding
const app = {};

// checking sms
sendTwilioSMS("01790314627", "First time sending sms using NODE.js", (err) => {
  console.log("Error from Twilio", err);
});

// create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    console.log(`Listening to port number ${environment.port}`);
  });
};

// handle request and response
app.handleReqRes = handleReqRes;

// Start the server
app.createServer();
