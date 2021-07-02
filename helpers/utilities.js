/*
 * Title: Utilities
 * Description: Important utilities functions
 * Author: Numan Ahmed
 * Date: 01-09-2021
 */
// dependencies
const crypto = require("crypto");
const environments = require("./environment");

// module scaffolding
const utilities = {};

// Parse json string to objects
utilities.parseJSON = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }
  return output;
};

// hash string
utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    let hash = crypto
      .createHmac("sha256", environments.secretKey)
      .update(str)
      .digest("hex");

    return hash;
  } else {
    return false;
  }
};

// create random string
utilities.createRandomStr = (strLength) => {
  let length = strLength;
  length = typeof strLength === "number" && strLength > 0 ? strLength : false;

  if (length) {
    let possibleCharacters = "abcdefghijklmlopqrstuvwxyz1234567890";
    let output = "";
    for (let i = 1; i <= length; i += 1) {
      const randomCharacters = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      output += randomCharacters;
    }
    return output;
  }
  return false;
};

module.exports = utilities;
