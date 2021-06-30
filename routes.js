/*
 * Title: Routes
 * Description: Application Routes
 * Author: Numan Ahmed
 * Date: 29-06-2021
 */

// dependencies
const { sampleHandler } = require('./handlers/RouteHandler/sampleHandler');

const routes = {
    sample: sampleHandler,
};

module.exports = routes;
