/*
 *
 * Title: Not Found Handler
 * Description: Not found Handler
 * Author: Numan Ahmed
 * Date: 29-06-2021
 *
 */

// module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
  callback(404, {
    message: "Your requested URL was not found!",
  });
};

module.exports = handler;
