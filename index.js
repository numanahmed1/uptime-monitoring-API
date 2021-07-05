/*
 * Title: Initial file
 * Description: Initial file to start the server and workers
 * Author: Numan Ahmed
 * Date: 04-07-2021
 */

// dependencies
const server = require("./lib/server");
const worker = require("./lib/worker");

// app object module scaffolding
const app = {};

app.init = () => {
  // start the server
  server.init();
  // start the worker
  worker.init();
};

app.init();

module.exports = app;
