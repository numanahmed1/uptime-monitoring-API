/*
 *
 * Title: Sample Handler
 * Description: Sample Handler
 * Author: Numan Ahmed
 * Date: 29-06-2021
 *
 */

// module scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
  callback(200, {
    message: "This is a sample url",
  });
};

module.exports = handler;
