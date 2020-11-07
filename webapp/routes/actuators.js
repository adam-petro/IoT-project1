const express = require('express');
const router = express.Router();
const resources = require('../resources').resources;
const azureIoT = require("../plugins/azureIoTHubConnector");


router.route('/').get((req, res, next) => {
    res.body = (resources[req.deviceId].actuators);
    next();
});

router.route('/leds').get((req, res, next) => {
    res.body = (resources[req.deviceId].actuators.leds);
    next();
});

router.route('/leds/:id').get((req, res, next) => {
    res.body = (resources[req.deviceId].actuators.leds[req.params.id]);
    next();
});


router.route('/leds/:id').put((req, res, next) => {
    let requestBody = req.body;

    let deviceId = req.deviceId;
    let ledID = req.params.id;
    let newValue = false;

    if (requestBody === undefined || requestBody["value"] === undefined) {
        ledValue = resources[deviceId].actuators.leds[ledID].value;
        newValue = !ledValue;
    } else {
        newValue = requestBody['value'];
    }

    let command = {
        "ledID": ledID,
        "value": newValue
    }

    azureIoT.sendMessageToDevice(deviceId, command);

    res.body = (resources[deviceId].actuators.leds[ledID]);
    next();
});



module.exports = router;