const si = require("systeminformation");
const resources = require("../../resources").resources;

let frequency, sensor, interval;
const model = resources.pi.sensors.cpuTemperature;
const pluginName = resources.pi.sensors.cpuTemperature.name;



exports.start = function (newFrequency) {
    frequency = newFrequency;
    connectHardware();

}

exports.stop = function () {
    clearInterval(interval);
    console.log("plugin " + pluginName + " stopped");
}


function connectHardware() {
    interval = setInterval(async () => {
        model.value = (await si.cpuTemperature()).main;
    }, frequency);
}

function showValue() {
    console.log("The current CPU temperature is " + model.value + model.unit)
}