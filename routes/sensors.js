const express = require('express');
const router = express.Router();

const resources = require('../resources').resources;


router.route('/').get((req, res, next) => {
    res.body = (resources.pi.sensors);
    next();
});

router.route('/dht').get((req, res, next) => {
    res.body = (resources.pi.sensors.dht);
    next();
});

router.route('/dht/:type').get((req, res, next) => {
    res.body = (resources.pi.sensors.dht[req.params.type]);
    next();
});

router.route('/distance').get((req, res, next) => {
    res.body = (resources.pi.sensors.distance);
    next();
});

router.route('/cpuTemperature').get((req, res, next) => {
    res.body = (resources.pi.sensors.cpuTemperature);
    next();
});


module.exports = router;