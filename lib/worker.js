/*
 * Title: Worker library
 * Description: Worker related file
 * Author: Numan Ahmed
 * Date: 04-07-2021
 */

// dependencies
const url = require("url");
const { parseJSON } = require("../helpers/utilities");
const data = require("./data");
const http = require("http");
const https = require("https");
const { sendTwilioSMS } = require("../helpers/notification");

// worker object module scaffolding
const worker = {};

// lookup all the check from database
worker.gatherAllChecks = () => {
  // get all the checks
  data.list("checks", (err1, checks) => {
    if (!err1 && checks && checks.length > 0) {
      checks.forEach((check) => {
        // read the data
        data.read("checks", check, (err2, mainCheckData) => {
          if (!err2 && mainCheckData) {
            worker.validateCheckData(parseJSON(mainCheckData));
          } else {
            console.log("Error: reading one of the check data!");
          }
        });
      });
    } else {
      console.log("Could not found any checks for process!");
    }
  });
};

// validate individual check data
worker.validateCheckData = (mainCheckData) => {
  if (mainCheckData && mainCheckData.id) {
    mainCheckData.state =
      typeof mainCheckData.state === "string" &&
      ["up", "down"].indexOf(mainCheckData.state) > -1
        ? mainCheckData.state
        : "down";

    mainCheckData.lastChecked =
      typeof mainCheckData.lastChecked === "number" &&
      mainCheckData.lastChecked > 0
        ? mainCheckData.lastChecked
        : false;

    // next process performing
    worker.performChecks(mainCheckData);
  } else {
    console.log("Error: Check was not invalid or properly formatted!");
  }
};

// perform checks
worker.performChecks = (mainCheckData) => {
  // prepare the initial check outcome
  let checkOutcome = {
    error: false,
    responseCode: false,
  };

  // mark the outcome has not sent yet
  let outcomeSent = false;

  // parse the hostname and full url form original data
  const parsedUrl = url.parse(
    mainCheckData.protocol + "://" + mainCheckData.url,
    true
  );
  const hostname = parsedUrl.hostname;
  const { path } = parsedUrl;

  // construct the request
  const requestDetails = {
    protocol: mainCheckData.protocol + ":",
    hostname: hostname,
    method: mainCheckData.method.toUpperCase(),
    path: path,
    timeout: mainCheckData.timeoutSeconds * 1000,
  };

  const protocolToUse = mainCheckData.protocol === "http" ? http : https;

  const req = protocolToUse.request(requestDetails, (res) => {
    // grab the status code
    const status = res.statusCode;
    console.log(status);
    checkOutcome.responseCode = status;
    // update the check outcome and pass to the next process
    if (!outcomeSent) {
      worker.processCheckOutcome(mainCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  // handle error
  req.on("error", (e) => {
    let checkOutcome = {
      error: true,
      value: e,
    };

    // update the check outcome and pass to the next process
    if (!outcomeSent) {
      worker.processCheckOutcome(mainCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  // handle timeout
  req.on("timeout", () => {
    let checkOutcome = {
      error: true,
      value: "timeout",
    };

    // update the check outcome and pass to the next process
    if (!outcomeSent) {
      worker.processCheckOutcome(mainCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  // req send
  req.end();
};

// processing for checks to update the checks
worker.processCheckOutcome = (mainCheckData, checkOutcome) => {
  // check if checks up or down
  let state =
    !checkOutcome.error &&
    checkOutcome.responseCode &&
    mainCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1
      ? "up"
      : "down";

  // decide whether we should notified the user or not
  let alertWanted = !!(
    mainCheckData.lastChecked && mainCheckData.state !== state
  );

  // update the check data
  let newCheckData = mainCheckData;
  newCheckData.state = state;
  newCheckData.lastChecked = Date.now();

  // update the store
  data.update("checks", newCheckData.id, newCheckData, (err1) => {
    if (!err1) {
      if (alertWanted) {
        worker.alterUserStateChange(newCheckData);
      } else {
        console.log("Alert not needed as there is no state change!");
      }
    } else {
      console.log("Error: trying to save data of one of the checks!");
    }
  });
};

// send sms to user
worker.alterUserStateChange = (newCheckData) => {
  let msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${
    newCheckData.protocol
  }://${newCheckData.url} is currently ${newCheckData.state}`;
  console.log(newCheckData.userPhone);
  sendTwilioSMS(newCheckData.userPhone, msg, (err) => {
    if (!err) {
      console.log(`User was altered to a state change via SMS: ${msg}`);
    } else {
      console.log("There was a problem to sending the sms to one of user!");
    }
  });
};

// time to execute the worker process once per minutes
worker.loop = () => {
  setInterval(() => {
    worker.gatherAllChecks();
  }, 1000 * 60);
};

// Start the server
worker.init = () => {
  // execute all the checks
  worker.gatherAllChecks();

  // check the loop so that work continue
  worker.loop();
};

module.exports = worker;
