


const resources = require("../../resources").resources;

var sensor = require("node-dht-sensor");
let frequency, interval;
const model = resources.pi.sensors.dht;
const pluginName = resources.pi.sensors.dht.name;




exports.start = function (newFrequency) {
    frequency = newFrequency;
    connectHardware();
}


exports.stop = function () {
    clearInterval(interval);
    console.log("plugin " + pluginName + " stopped");
}



function connectHardware() {
    interval = setInterval(() => {
        sensor.read(11, model.temperature.gpio, function (err, temperature, humidity) {
            if (!err) {
                // console.log(`temp: ${temperature}°C, humidity: ${humidity}%`);
                model.humidity.value = humidity;
                model.temperature.value = temperature;
            } else {
                console.log('Panic: DHT fail');
            }
        });
    }, frequency);
}

function showValue() {
    console.log("The current DHT temperature is " + model.temperature.value + model.temperature.unit + " and the humidity is " + model.humidity.value + model.humidity.unit)
}