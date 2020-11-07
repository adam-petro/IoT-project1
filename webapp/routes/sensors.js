const express = require('express');
const router = express.Router();

const resources = require('../resources').resources;


router.route('/').get((req, res, next) => {
    res.body = (resources[req.deviceId].sensors);
    next();
});

router.route('/:type').get((req, res, next) => {
    res.body = (resources[req.deviceId].sensors[req.params.type]);
    next();
});

module.exports = router;