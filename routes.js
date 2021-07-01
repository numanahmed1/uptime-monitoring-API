/*
 * Title: Routes
 * Description: Application Routes
 * Author: Numan Ahmed
 * Date: 29-06-2021
 */

// dependencies
const { userHandler } = require("./handlers/RouteHandler/userHandler");
const { sampleHandler } = require("./handlers/RouteHandler/sampleHandler");

const routes = {
  sample: sampleHandler,
  user: userHandler,
};

module.exports = routes;
