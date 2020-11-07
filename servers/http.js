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
app.get('/', (req, res) => {
    res.render('../views/pages/index');
});

//Root path for the pi resource
app.get('/pi', (req, res, next) => {
    res.body = resources.pi;
    next();
});

//Route for the sensors
app.use('/pi/sensors', sensorRoutes);

//Route for the actuators
app.use('/pi/actuators', actuatorRoutes);

//Apply renderer middleware
app.use('/pi', renderer);

module.exports = app;