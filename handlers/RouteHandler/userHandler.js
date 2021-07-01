/*
 *
 * Title: User Handler
 * Description: User Handler
 * Author: Numan Ahmed
 * Date: 29-06-2021
 *
 */
// dependencies
const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");

// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._users = {};

handler._users.get = (requestProperties, callback) => {
  callback(200);
};

handler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

  const phoneNumber =
    typeof requestProperties.body.phoneNumber === "string" &&
    requestProperties.body.phoneNumber.trim().length === 11
      ? requestProperties.body.phoneNumber
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  const termsAgreement =
    typeof requestProperties.body.termsAgreement === "boolean"
      ? requestProperties.body.termsAgreement
      : false;

  if (firstName && lastName && phoneNumber && password && termsAgreement) {
    // checking is user exists
    data.read("users", phoneNumber, (err1) => {
      if (err1) {
        const userObj = {
          firstName,
          lastName,
          phoneNumber,
          password: hash(password),
          termsAgreement,
        };
        // store the user to db
        data.create("users", phoneNumber, userObj, (err2) => {
          if (!err2) {
            callback(200, {
              message: "User created successfully.",
            });
          } else {
            callback(500, { Error: "Could not create new user!" });
          }
        });
      } else {
        callback("There is a problem in server side!");
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request!",
    });
  }
};

handler._users.put = (requestProperties, callback) => {
  callback("PUT");
};

handler._users.delete = (requestProperties, callback) => {
  callback("Delelte");
};

module.exports = handler;
