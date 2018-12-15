/**
 * 
 * :::: DOCUMENTATION from former Lambda SMS template ::::
 * 
 * This is a sample Lambda function that sends an SMS on click of a
 * button. It needs one permission sns:Publish. The following policy
 * allows SNS publish to SMS but not topics or endpoints.
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "sns:Publish"
            ],
            "Resource": [
                "*"
            ]
        },
        {
            "Effect": "Deny",
            "Action": [
                "sns:Publish"
            ],
            "Resource": [
                "arn:aws:sns:*:*:*"
            ]
        }
    ]
}
 *
 * The following JSON template shows what is sent as the payload:
{
    "serialNumber": "GXXXXXXXXXXXXXXXXX",
    "batteryVoltage": "xxmV",
    "clickType": "SINGLE" | "DOUBLE" | "LONG"
}
 *
 * A "LONG" clickType is sent if the first press lasts longer than 1.5 seconds.
 * "SINGLE" and "DOUBLE" clickType payloads are sent for short clicks.
 *
 * For more documentation, follow the link below.
 * http://docs.aws.amazon.com/iot/latest/developerguide/iot-lambda-rule.html
 */

/**
 * 
 * :::: DOCUMENTATION from former Lambda IFTTT template ::::
 * 
 * This is a sample that connects Lambda with IFTTT Maker channel. The event is
 * sent in this format: <serialNumber>-<clickType>.
 *
 * The following JSON template shows what is sent as the payload:
{
    "serialNumber": "GXXXXXXXXXXXXXXXXX",
    "batteryVoltage": "xxmV",
    "clickType": "SINGLE" | "DOUBLE" | "LONG"
}
 *
 * A "LONG" clickType is sent if the first press lasts longer than 1.5 seconds.
 * "SINGLE" and "DOUBLE" clickType payloads are sent for short clicks.
 *
 * For more documentation, follow the link below.
 * http://docs.aws.amazon.com/iot/latest/developerguide/iot-lambda-rule.html
 */

"use strict";

// const AWS = require("aws-sdk");
const https = require("https");

const iftttApiKey = process.env.IFTTT_API_KEY;

exports.handler = (event, context, callback) => {
  /*
  Lambda func for sending SMS:

  console.log("Received event:", event);

  console.log(`Sending SMS to ${PHONE_NUMBER}`);
  const payload = JSON.stringify(event);
  const params = {
    PhoneNumber: PHONE_NUMBER,
    Message: `Hello from your IoT Button ${
      event.serialNumber
    }. Here is the full event: ${payload}.`
  };
  // result will go to function callback
  SNS.publish(params, callback);
  */

  // make sure you created a receipe for event <serialNumber>-<clickType>
  const webhookEvent = `${event.serialNumber}-${event.clickType}`;
  const url = `https://maker.ifttt.com/trigger/${webhookEvent}/with/key/${iftttApiKey}`;
  https
    .get(url, res => {
      let body = "";
      console.log(`STATUS: ${res.statusCode}`);
      res.on("data", chunk => (body += chunk));
      res.on("end", () => {
        console.log("Event has been sent to IFTTT Maker channel");
        callback(null, body);
      });
    })
    .on("error", e => {
      console.log("Failed to trigger Maker channel", e);
      callback(`Failed to trigger Maker channel: ${e.message}`);
    });
};
