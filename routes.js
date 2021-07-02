/*
 * Title: Routes
 * Description: Application Routes
 * Author: Numan Ahmed
 * Date: 29-06-2021
 */

// dependencies
const { userHandler } = require("./handlers/RouteHandler/userHandler");
const { sampleHandler } = require("./handlers/RouteHandler/sampleHandler");
const { tokenHandler } = require("./handlers/RouteHandler/tokenHandler");

const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
};

module.exports = routes;
