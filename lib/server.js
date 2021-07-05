/*
 * Title: Server library
 * Description: Server related file
 * Author: Numan Ahmed
 * Date: 04-07-2021
 */

// dependencies
const http = require("http");
const { handleReqRes } = require("../helpers/handleReqRes");
const environment = require("../helpers/environment");

// app object module scaffolding
const server = {};

// create server
server.createServer = () => {
  const createServerVar = http.createServer(server.handleReqRes);
  createServerVar.listen(environment.port, () => {
    console.log(`Listening to port number ${environment.port}`);
  });
};

// handle request and response
server.handleReqRes = handleReqRes;

// Start the server
server.init = () => {
  server.createServer();
};

module.exports = server;
