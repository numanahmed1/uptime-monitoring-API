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
};

environments.production = {
  port: 5000,
  envName: "production",
  secretKey: "uywervusyd56s",
  maxChecks: 5,
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
