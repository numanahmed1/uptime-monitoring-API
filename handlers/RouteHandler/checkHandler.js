/*
 *
 * Title: check Handler
 * Description: check Handler
 * Author: Numan Ahmed
 * Date: 03-07-2021
 *
 */
// dependencies
const data = require("../../lib/data");
const { hash, parseJSON, createRandomStr } = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");
const environments = require("../../helpers/environment");

// module scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._check = {};

handler._check.get = (requestProperties, callback) => {
  // check the id is valid
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    // lookup the check
    data.read("checks", id, (err1, checkData) => {
      if (!err1 && checkData) {
        // verify token
        let token =
          typeof requestProperties.headersObject.token === "string"
            ? requestProperties.headersObject.token
            : false;
        //token verify
        tokenHandler._token.verify(
          token,
          parseJSON(checkData).userPhone,
          (isTokenValid) => {
            if (isTokenValid) {
              callback(200, parseJSON(checkData));
            } else {
              callback(403, {
                Error: "You are not authorized!",
              });
            }
          }
        );
      } else {
        callback(500, {
          Error: "There is a problem in server side!",
        });
      }
    });
  } else {
    callback(400, {
      Error: "There is a problem in your request!",
    });
  }
};

handler._check.post = (requestProperties, callback) => {
  let protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  let url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  let method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;

  let successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;

  let timeoutSeconds =
    typeof requestProperties.body.timeoutSeconds === "number" &&
    requestProperties.body.timeoutSeconds % 1 === 0 &&
    requestProperties.body.timeoutSeconds >= 1 &&
    requestProperties.body.timeoutSeconds <= 5
      ? requestProperties.body.timeoutSeconds
      : false;

  if (protocol && url && method && successCodes && timeoutSeconds) {
    // verify token
    let token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;

    // look up the user phone by token
    data.read("tokens", token, (err1, tokenData) => {
      if (!err1 && tokenData) {
        let userPhone = parseJSON(tokenData).phoneNumber;

        // lookup the user data
        data.read("users", userPhone, (err2, userData) => {
          if (!err2 && userData) {
            //token verify
            tokenHandler._token.verify(token, userPhone, (isTokenValid) => {
              if (isTokenValid) {
                const userObj = parseJSON(userData);

                const userChecks =
                  typeof userObj.checks === "object" &&
                  userObj.checks instanceof Array
                    ? userObj.checks
                    : [];

                if (userChecks.length < environments.maxChecks) {
                  // check id
                  let checkId = createRandomStr(20);
                  let checkObj = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeoutSeconds,
                  };

                  // save the check object to store
                  data.create("checks", checkId, checkObj, (err3) => {
                    if (!err3) {
                      // add check id to user object
                      userObj.checks = userChecks;
                      userObj.checks.push(checkId);

                      // save the new user data
                      data.update("users", userPhone, userObj, (err4) => {
                        if (!err4) {
                          callback(200, checkObj);
                        } else {
                          callback(500, {
                            Error: "There is a problem in server side!",
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        Error: "There is a problem in server side!",
                      });
                    }
                  });
                } else {
                  callback(401, {
                    Error: "User has already reached max checks limit!",
                  });
                }
              } else {
                callback(403, {
                  Error: "Authentication problem!",
                });
              }
            });
          } else {
            callback(404, {
              Error: "User not found!",
            });
          }
        });
      } else {
        callback(403, {
          Error: "Authentication problem!",
        });
      }
    });
  } else {
    callback(400, {
      Error: "There is a problem in your request!",
    });
  }
};

handler._check.put = (requestProperties, callback) => {
  // check the id is valid
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;

  let protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  let url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  let method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;

  let successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;

  let timeoutSeconds =
    typeof requestProperties.body.timeoutSeconds === "number" &&
    requestProperties.body.timeoutSeconds % 1 === 0 &&
    requestProperties.body.timeoutSeconds >= 1 &&
    requestProperties.body.timeoutSeconds <= 5
      ? requestProperties.body.timeoutSeconds
      : false;

  if (id) {
    if (protocol || url || method || successCodes || timeoutSeconds) {
      data.read("checks", id, (err1, checkData) => {
        if (!err1 && checkData) {
          let checkObj = parseJSON(checkData);
          // verify token
          let token =
            typeof requestProperties.headersObject.token === "string"
              ? requestProperties.headersObject.token
              : false;
          //token verify
          tokenHandler._token.verify(
            token,
            checkObj.userPhone,
            (isTokenValid) => {
              if (isTokenValid) {
                if (protocol) {
                  checkObj.protocol = protocol;
                }
                if (url) {
                  checkObj.url = url;
                }
                if (method) {
                  checkObj.method = method;
                }
                if (successCodes) {
                  checkObj.successCodes = successCodes;
                }
                if (timeoutSeconds) {
                  checkObj.timeoutSeconds = timeoutSeconds;
                }

                // update the store
                data.update("checks", id, checkObj, (err2) => {
                  if (!err2) {
                    callback(200, checkObj);
                  } else {
                    callback(500, {
                      Error: "There was a problem in server side!",
                    });
                  }
                });
              } else {
                callback(403, {
                  Error: "You are not authorized!",
                });
              }
            }
          );
        } else {
          callback(500, {
            Error: "There was a problem in server side!",
          });
        }
      });
    } else {
      callback(400, {
        Error: "You must provide at least one field to update!",
      });
    }
  } else {
    callback(400, {
      Error: "There is a problem in your request!",
    });
  }
};

handler._check.delete = (requestProperties, callback) => {
  // check the id is valid
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    // lookup the check
    data.read("checks", id, (err1, checkData) => {
      if (!err1 && checkData) {
        // verify token
        let token =
          typeof requestProperties.headersObject.token === "string"
            ? requestProperties.headersObject.token
            : false;
        let userPhone = parseJSON(checkData).userPhone;
        //token verify
        tokenHandler._token.verify(token, userPhone, (isTokenValid) => {
          if (isTokenValid) {
            data.delete("checks", id, (err2) => {
              if (!err2) {
                // lookup the user data
                data.read("users", userPhone, (err3, userData) => {
                  let userObj = parseJSON(userData);
                  if (!err3 && userData) {
                    let userChecks =
                      typeof userObj.checks === "object" &&
                      userObj.checks instanceof Array
                        ? userObj.checks
                        : [];

                    // remove the checks id from users list of checks
                    let checkIdPosition = userChecks.indexOf(id);
                    if (checkIdPosition > -1) {
                      userChecks.splice(checkIdPosition, 1);

                      // update the user data
                      userObj.checks = userChecks;
                      data.update(
                        "users",
                        userObj.phoneNumber,
                        userObj,
                        (err4) => {
                          if (!err4) {
                            callback(200);
                          } else {
                            callback(500, {
                              Error: "There was a problem in server side!",
                            });
                          }
                        }
                      );
                    } else {
                      callback(404, {
                        Error:
                          "The check id you trying to delete is not found in user!",
                      });
                    }
                  } else {
                    callback(500, {
                      Error: "There was a problem in server side!",
                    });
                  }
                });
              } else {
                callback(500, {
                  Error: "There was a problem in server side!",
                });
              }
            });
          } else {
            callback(403, {
              Error: "You are not authorized!",
            });
          }
        });
      } else {
        callback(500, {
          Error: "There is a problem in server side!",
        });
      }
    });
  } else {
    callback(400, {
      Error: "There is a problem in your request!",
    });
  }
};

module.exports = handler;
