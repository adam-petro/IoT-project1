const Protocol = require('azure-iot-device-mqtt').Mqtt;
const Client = require('azure-iot-device').Client;
const Message = require('azure-iot-device').Message;

const resources = require("./resources").resources;
const cpuPlugin = require('./plugins/cpuPlugin');
const dhtPlugin = require('./plugins/dhtPlugin');
const distancePlugin = require('./plugins/distancePlugin');
const ledsPlugin = require('./plugins/ledsPlugin');

// String containing Hostname, Device Id & Device Key in the following formats:
//  "HostName=<iothub_host_name>;DeviceId=<device_id>;SharedAccessKey=<device_key>"

const deviceConnectionString = process.env.DEVICE_CONNECTION_STRING;
let sendInterval;

function disconnectHandler() {
    clearInterval(sendInterval);
    client.open().catch((err) => {
        console.error(err.message);
    });
}


cpuPlugin.start(2000);
dhtPlugin.start(2000);
distancePlugin.start(2000);
ledsPlugin.start();

process.on('SIGINT', function () {
    dhtPlugin.stop();
    cpuPlugin.stop();
    distancePlugin.stop();
    ledsPlugin.stop();
    setTimeout(() => {
        console.log("exiting...");
        process.exit();
    }, 5000)
});

//{"ledID":"led1","value":true}
function messageHandler(msg) {
    const body = JSON.parse(msg.data);

    if (body.ledID !== undefined && body.value !== undefined) {
        resources.pi.actuators.leds[body.ledID].value = body.value;
        sendMessage();
    } else {
        console.log("Invalid message format received: " + msg.data)
    }
}

function generateMessage() {
    const message = new Message(JSON.stringify(resources));

    return message;
}

function errorCallback(err) {
    console.error(err.message);
}

function connectCallback() {
    console.log('Client connected');
    // Create a message and send it to the IoT Hub every two seconds
    sendInterval = setInterval(() => {
        sendMessage();
    }, 30000);

}

function sendMessage() {
    const message = generateMessage();
    console.log('Sending message');
    client.sendEvent(message, printResultFor('send'));
}

// fromConnectionString must specify a transport constructor, coming from any transport package.
let client = Client.fromConnectionString(deviceConnectionString, Protocol);

client.on('connect', connectCallback);
client.on('error', errorCallback);
client.on('disconnect', disconnectHandler);
client.on('message', messageHandler);

client.open()
    .catch(err => {
        console.error('Could not connect: ' + err.message);
    });

// Helper function to print results in the console
function printResultFor(op) {
    return function printResult(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}