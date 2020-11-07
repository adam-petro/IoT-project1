


const resources = require("../resources").resources;

var sensor = require("node-dht-sensor");
let frequency, interval;
const temperatureModel = resources.pi.sensors.dhtTemperature;
const humidityModel = resources.pi.sensors.dhtHumidity;





exports.start = function (newFrequency) {
    frequency = newFrequency;
    connectHardware();
}


exports.stop = function () {
    clearInterval(interval);
    console.log("plugin DHT11 stopped");
}



function connectHardware() {
    interval = setInterval(() => {
        sensor.read(11, temperatureModel.gpio, function (err, temperature, humidity) {
            if (!err) {
                // console.log(`temp: ${temperature}°C, humidity: ${humidity}%`);
                humidityModel.value = humidity;
                temperatureModel.value = temperature;
            } else {
                console.log('Panic: DHT fail');
            }
        });
    }, frequency);
}

function showValue() {
    console.log("The current DHT temperature is " + temperatureModel.value + temperatureModel.unit + " and the humidity is " + humidityModel.value + humidityModel.unit)
}