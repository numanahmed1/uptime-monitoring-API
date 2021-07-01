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
const { hash, parseJSON } = require("../../helpers/utilities");

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
  // check the phone number is valid
  const phoneNumber =
    typeof requestProperties.queryStringObject.phoneNumber === "string" &&
    requestProperties.queryStringObject.phoneNumber.trim().length === 11
      ? requestProperties.queryStringObject.phoneNumber
      : false;

  if (phoneNumber) {
    // lookup the user
    data.read("users", phoneNumber, (err1, user) => {
      let userData = { ...parseJSON(user) };
      if (!err1 && userData) {
        delete userData.password;
        callback(200, userData);
      } else {
        callback(404, {
          Error: "Requested user was not found!",
        });
      }
    });
  } else {
    callback(404, {
      Error: "Requested user was not found!",
    });
  }
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
  // checking validation
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

  if (phoneNumber) {
    if (firstName || lastName || password) {
      // lookup the user
      data.read("users", phoneNumber, (err1, user) => {
        const userData = { ...parseJSON(user) };
        if (!err1 && userData) {
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.lastName = lastName;
          }
          if (password) {
            userData.password = hash(password);
          }

          // update the data
          data.update("users", phoneNumber, userData, (err2) => {
            if (!err2) {
              callback(200, {
                Message: "User was updated successfully.",
              });
            } else {
              callback(500, {
                Error: "There is a problem in server side!",
              });
            }
          });
        } else {
          callback(400, {
            Error: "You have a problem in your request!",
          });
        }
      });
    } else {
      callback(400, {
        Error: "You have a problem in your request!",
      });
    }
  } else {
    callback(400, {
      Error: "Invalid phone number. Please try again!",
    });
  }
};

handler._users.delete = (requestProperties, callback) => {
  // check the phone number is valid
  const phoneNumber =
    typeof requestProperties.queryStringObject.phoneNumber === "string" &&
    requestProperties.queryStringObject.phoneNumber.trim().length === 11
      ? requestProperties.queryStringObject.phoneNumber
      : false;

  if (phoneNumber) {
    // lookup the user
    data.read("users", phoneNumber, (err1, userData) => {
      if (!err1 && userData) {
        data.delete("users", phoneNumber, (err2) => {
          if (!err2) {
            callback(200, {
              Error: "User is successfully deleted!",
            });
          } else {
            callback(500, {
              Error: "There is a problem in server side.",
            });
          }
        });
      } else {
        callback(500, {
          Error: "There is a problem in server side.",
        });
      }
    });
  } else {
    callback(400, {
      Error: "There was a problem in your request!",
    });
  }
};

module.exports = handler;
