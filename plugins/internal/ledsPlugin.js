const si = require("systeminformation");
const resources = require("../../resources").resources;
const resourcesEE = require("../../resources").resourcesEE;

const Gpio = require('pigpio').Gpio;

let actuators = {};
const model = resources.pi.actuators.leds;
const pluginName = "Led Plugin";





exports.start = function () {
    connectHardware();
}

exports.stop = function () {
    console.log("plugin " + pluginName + " stopped");
}


function connectHardware() {
    Object.keys(model).forEach((key) => {
        actuators[key] = new Gpio(model[key].gpio, { mode: Gpio.OUTPUT });
        actuators[key].digitalWrite(model[key].value ? 1 : 0);
    })
}

switchOnOff = function () {
    Object.keys(model).forEach((key) => {
        actuators[key].digitalWrite(model[key].value ? 1 : 0);
    })
}

//Listen for changes on resources file and run switchOnOff in case of change
resourcesEE.on("change", switchOnOff)
