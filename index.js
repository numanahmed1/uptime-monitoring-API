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

// app object module scaffolding
const app = {};

data.create("test", "newFile", { name: "hello", tk: "1000" }, (err) => {
  console.log(`Error was ${err}`);
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
