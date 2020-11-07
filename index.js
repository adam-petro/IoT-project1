const express = require("express");
const EventEmitter = require('events');
const cors = require("cors");
const sseExpress = require("sse-express");
const si = require('systeminformation');
const Gpio = require('pigpio').Gpio;
const dht = require('pigpio-dht');

//Set up sensors and actuators pins
const ledPin = 4;
const distanceSensor_triggerPin = 23;
const distanceSensor_echoPin = 24;
const dhtPin = 12;

//Set up the actual sensors and actuators 
const led = new Gpio(ledPin, { mode: Gpio.OUTPUT });
const distanceSensor_trigger = new Gpio(distanceSensor_triggerPin, { mode: Gpio.OUTPUT });
const distanceSensor_echo = new Gpio(distanceSensor_echoPin, { mode: Gpio.INPUT, alert: true });
const dhtSensor = dht(dhtPin, 11);



//Set up stream emitter for real-time updated values
const Stream = new EventEmitter();

//State is a json containing all the values of sensors and actuators. It is to be sent in all requests.
const state = {
    ledOn: false,
    cpuTemperature: 0.00,
    sensorTemperature: 0.00,
    sensorHumidity: 0.00,
    radarDistance: 0.00,
};

//Setting up digital sensor
distanceSensor_trigger.digitalWrite(0);
const MICROSECDONDS_PER_CM = 1e6 / 34321;



//Function reading the state of distance sensor
const watchHCSR04 = () => {
    let startTick;
    distanceSensor_echo.on('alert', (level, tick) => {
        if (level == 1) {
            startTick = tick;
        } else {
            const endTick = tick;
            const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
            state.radarDistance = (diff / 2 / MICROSECDONDS_PER_CM);
        }
    });
};

watchHCSR04();

// Trigger a distance measurement once per second
setInterval(() => {
    distanceSensor_trigger.trigger(10, 1); // Set trigger high for 10 microseconds
}, 1000);



//Function reading the DHT sensor value, also update cpu temp
setInterval(() => {
    dhtSensor.read();
    si.cpuTemperature().then((data) => { state.cpuTemperature = data; });
}, 1000);

dhtSensor.on('result', data => {
    state.sensorTemperature = data.temperature;
    state.sensorHumidity = data.humidity;
});


const main = async () => {
    const app = express();
    app.use(cors());

    //Set the view engine to html.
    app.set("view engine", "ejs");
    //Set the app to use express middleware
    app.use(express.static(__dirname + '/public'));

    //Serve the root path. Index page.
    app.get("/", (req, res) => {
        res.render("pages/index");
    })

    app.get("/led/toggle", (req, res) => {

        //Update the main state variable the new state of led.
        state.ledOn = !state.ledOn;
        //write the new state of led.
        led.digitalWrite(state.ledOn ? 1 : 0);
        //send response.
        res.set('Content-Type', 'application/json')
        res.end(JSON.stringify({ state: state }));
    })

    //Set /data path to send server sent events to stream sensor data.
    app.get("/data", sseExpress(), function(req, res){
        setInterval(() => {
            res.sse({
                event: 'connected',
                data: state
            });
        }, 1000);
    });

    //Listen the app on 8080 port.
    app.listen(8080, () => {
        console.log("server running");
    })
}

main();
