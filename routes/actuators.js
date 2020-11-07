const express = require('express');
const router = express.Router();
const resources = require('../resources').resources;

router.route('/').get((req, res, next) => {
    res.body = (resources.pi.actuators);
    next();
});

router.route('/leds').get((req, res, next) => {
    res.body = (resources.pi.actuators.leds);
    next();
});

router.route('/leds/:id').get((req, res, next) => {
    res.body = (resources.pi.actuators.leds[req.params.id]);
    next();
});


router.route('/leds/:id').put((req, res, next) => {
    let requestBody = req.body;

    if (requestBody === undefined || requestBody["value"] === undefined) {
        ledValue = resources.pi.actuators.leds[req.params.id].value;
        resources.pi.actuators.leds[req.params.id].value = !ledValue;
    } else {
        console.log(resources.pi.actuators.leds[req.params.id].value)
        resources.pi.actuators.leds[req.params.id].value = requestBody['value'];
    }

    res.body = (resources.pi.actuators.leds[req.params.id]);
    next();
});



module.exports = router;