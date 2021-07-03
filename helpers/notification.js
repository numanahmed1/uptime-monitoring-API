/*
 * Title: Notification
 * Description: Notification handler
 * Author: Numan Ahmed
 * Date: 03-07-2021
 */

// dependencies
const https = require("https");
const { twilio } = require("./environment");
const querystring = require("querystring");

// module scaffolding
const notifications = {};

// send notification to user using twilio API
notifications.sendTwilioSMS = (phoneNumber, msg, callback) => {
  // input validation
  let userPhone =
    typeof phoneNumber === "string" && phoneNumber.trim().length === 11
      ? phoneNumber.trim()
      : false;

  let userMsg =
    typeof msg === "string" &&
    msg.trim().length > 0 &&
    msg.trim().length <= 1600
      ? msg.trim()
      : false;

  if (userPhone && userMsg) {
    // configure the request payload
    const payload = {
      From: twilio.fromNumber,
      To: `+88${userPhone}`,
      Body: userMsg,
    };

    // stringify the payload
    const stringifyPayload = querystring.stringify(payload);

    // configure the request details
    const requestDetails = {
      hostname: "api.twilio.com",
      method: "POST",
      path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
      auth: `${twilio.accountSid}:${twilio.authToken}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    // instantiate the request object
    const req = https.request(requestDetails, (res) => {
      // get the status of the sent request
      const status = res.statusCode;

      if (status === 200 || status === 201) {
        callback(false);
      } else {
        callback(`Status code returned was ${status}`);
      }
    });

    req.on("error", (error) => {
      callback(error);
    });

    req.write(stringifyPayload);
    req.end();
  } else {
    callback("Given parameters were missing or invalid!");
  }
};

module.exports = notifications;
