/*
 * Title: Environment
 * Description: Handle Environment variables
 * Author: Numan Ahmed
 * Date: 29-06-2021
 */

// module scaffolding
const environments = {};

environments.staging = {
  port: 3000,
  envName: "staging",
  secretKey: "dekstkslthsdfk",
  maxChecks: 5,
  twilio: {
    fromNumber: "+15005550006",
    accountSid: "ACb32d411ad7fe886aac54c665d25e5c5d",
    authToken: "9455e3eb3109edc12e3d8c92768f7a67",
  },
};

environments.production = {
  port: 5000,
  envName: "production",
  secretKey: "uywervusyd56s",
  maxChecks: 5,
  twilio: {
    fromNumber: "+15005550006",
    accountSid: "ACb32d411ad7fe886aac54c665d25e5c5d",
    authToken: "9455e3eb3109edc12e3d8c92768f7a67",
  },
};

// determine which environment is passed
const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

// export corresponding environment object
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentToExport;
