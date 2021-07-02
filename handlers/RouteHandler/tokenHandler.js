/*
 *
 * Title: Token Handler
 * Description: Handler for token
 * Author: Numan Ahmed
 * Date: 01-07-2021
 *
 */
// dependencies
const data = require("../../lib/data");
const { hash, parseJSON, createRandomStr } = require("../../helpers/utilities");

// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._token = {};

handler._token.get = (requestProperties, callback) => {
  // check the id is valid
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    // lookup the token
    data.read("tokens", id, (err1, tokenData) => {
      let token = { ...parseJSON(tokenData) };
      if (!err1 && token) {
        callback(200, token);
      } else {
        callback(404, {
          Error: "Requested token was not found!",
        });
      }
    });
  } else {
    callback(404, {
      Error: "Requested token was not found!",
    });
  }
};

handler._token.post = (requestProperties, callback) => {
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

  if (phoneNumber && password) {
    data.read("users", phoneNumber, (err1, userData) => {
      let hashedPassword = hash(password);
      if (hashedPassword === parseJSON(userData).password) {
        let tokenId = createRandomStr(20);
        let expires = Date.now() + 60 * 60 * 1000;
        let tokenObj = {
          id: tokenId,
          phoneNumber,
          expires,
        };

        // store the data
        data.create("tokens", tokenId, tokenObj, (err2) => {
          if (!err2) {
            callback(200, tokenObj);
          } else {
            callback(500, {
              Error: "There was a problem in server side!",
            });
          }
        });
      } else {
        callback(400, {
          error: "Your password is not valid!",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request!",
    });
  }
};

handler._token.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;

  const extend =
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend === true
      ? true
      : false;

  if (id && extend) {
    data.read("tokens", id, (err1, tokenData) => {
      let tokenObj = parseJSON(tokenData);
      if (tokenObj.expires > Date.now()) {
        tokenObj.expires = Date.now() * 60 * 60 * 1000;

        // store the token
        data.update("tokens", id, tokenObj, (err2) => {
          if (!err2) {
            callback(200, {
              Error: "Token expire date 1 hour extended!",
            });
          } else {
            callback(500, {
              Error: "There was a problem in server side!",
            });
          }
        });
      } else {
        callback(400, {
          Error: "Token already expired!",
        });
      }
    });
  } else {
    callback(400, {
      Error: "There was a problem in your request!",
    });
  }
};

handler._token.delete = (requestProperties, callback) => {
  // check the phone number is valid
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    // lookup the user
    data.read("tokens", id, (err1, tokenData) => {
      if (!err1 && tokenData) {
        data.delete("tokens", id, (err2) => {
          if (!err2) {
            callback(200, {
              Message: "Token is successfully deleted!",
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

handler._token.verify = (id, phoneNumber, callback) => {
  data.read("tokens", id, (err1, tokenData) => {
    if (!err1 && tokenData) {
      if (
        parseJSON(tokenData).phoneNumber === phoneNumber &&
        parseJSON(tokenData).expires > Date.now()
      ) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

module.exports = handler;
