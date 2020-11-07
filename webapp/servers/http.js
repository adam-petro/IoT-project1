const express = require('express');
const cors = require('cors');
const bodyparser = require("body-parser")


const sensorRoutes = require('../routes/sensors');
const actuatorRoutes = require('../routes/actuators');
const resources = require('../resources').resources;
const renderer = require('../plugins/renderer');

const app = express();
app.use(cors());
app.use(bodyparser.json());



//Set the view engine to html.
app.set('view engine', 'ejs');

//Set the app to use express middleware
app.use(express.static(__dirname + '/../public'));

//Serve the root path. Index page.
app.get('/', (req, res, next) => {
    if (req.accepts()[0] === 'text/html') {
        res.render('../views/pages/index');
    } else {
        res.send(resources);
    }
});

//Root path for the pi resource
app.get('/:deviceId', (req, res, next) => {
    res.body = resources[req.params.deviceId];
    next();
});

//Route for the sensors
app.use('/:deviceId/sensors', (req, res, next) => {
    req.deviceId = req.params.deviceId;
    next();
}, sensorRoutes);

//Route for the actuators
app.use('/:deviceId/actuators', (req, res, next) => {
    req.deviceId = req.params.deviceId;
    next();
}, actuatorRoutes);

//Apply renderer middleware
app.use('/:deviceId', renderer);

module.exports = app;