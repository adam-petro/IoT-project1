
const Gpio = require('pigpio').Gpio;
const resources = require("../resources").resources;

let frequency, interval;
const model = resources.pi.sensors.distance;
const pluginName = resources.pi.sensors.distance.name;
let distanceSensor_trigger, distanceSensor_echo;
const MICROSECDONDS_PER_CM = 1e6 / 34321;



exports.start = function (newFrequency) {
    frequency = newFrequency;
    connectHardware();
}

exports.stop = function () {
    clearInterval(interval);
    console.log("plugin " + pluginName + " stopped");
}


function connectHardware() {
    distanceSensor_trigger = new Gpio(model.gpioTrigger, { mode: Gpio.OUTPUT });
    distanceSensor_echo = new Gpio(model.gpioEcho, { mode: Gpio.INPUT, alert: true });

    distanceSensor_trigger.digitalWrite(0);


    interval = setInterval(() => {
        distanceSensor_trigger.trigger(10, 1); // Set trigger high for 10 microseconds
    }, frequency);

    watchHCSR04();
}

//Function reading the state of distance sensor
const watchHCSR04 = () => {
    let startTick;
    distanceSensor_echo.on('alert', (level, tick) => {
        if (level == 1) {
            startTick = tick;
        } else {
            const endTick = tick;
            const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
            model.value = (diff / 2 / MICROSECDONDS_PER_CM);
        }
    });
};


function showValue() {
    console.log("The current DHT temperature is " + model.temperature.value + model.temperature.unit + " and the humidity is " + model.humidity.value + model.humidity.unit)
}