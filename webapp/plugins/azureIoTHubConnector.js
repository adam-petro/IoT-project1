

const { EventHubConsumerClient } = require("@azure/event-hubs");
const C2DClient = require('azure-iothub').Client;
const C2DMessage = require('azure-iot-common').Message;
let C2DServiceClient;

const resources = require("../resources").resources;
// Event Hub-compatible endpoint
// az iot hub show --query properties.eventHubEndpoints.events.endpoint --name {your IoT Hub name}
const eventHubsCompatibleEndpoint =
    "sb://ihsuproddbres030dednamespace.servicebus.windows.net";

// Event Hub-compatible name
// az iot hub show --query properties.eventHubEndpoints.events.path --name {your IoT Hub name}
const eventHubsCompatiblePath = "iothub-ehub-milestone3-4782274-af5506cf48";

// Primary key for the "service" policy to read messages
// az iot hub policy show --name service --query primaryKey --hub-name {your IoT Hub name}
const iotHubSasKey = "n+hDYWF5X8zQBlSEIAwGrbQpH49SZ5noisOcUbwuOYY=";

// If you have access to the Event Hub-compatible connection string from the Azure portal, then
// you can skip the Azure CLI commands above, and assign the connection string directly here.
const connectionString = `Endpoint=${eventHubsCompatibleEndpoint}/;EntityPath=${eventHubsCompatiblePath};SharedAccessKeyName=service;SharedAccessKey=${iotHubSasKey}`;

// Connection string for C2D messages
const C2DConnectionString = "HostName=milestone3Hub.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=n+hDYWF5X8zQBlSEIAwGrbQpH49SZ5noisOcUbwuOYY=";

var printError = function (err) {
    console.log(err.message);
};

// Display the message content - telemetry and properties.
// - Telemetry is sent in the message body
// - The device can add arbitrary properties to the message
// - IoT Hub adds system properties, such as Device Id, to the message.
var updateResources = function (messages) {
    for (const message of messages) {
        const deviceId = message.systemProperties["iothub-connection-device-id"];
        const body = message.body;
        console.log("Updating resource data for " + deviceId);
        resources[deviceId] = body["pi"];
    }
};

// C2D Communication method
exports.sendMessageToDevice = async function (targetDevice, body) {
    C2DServiceClient.open(function (err) {
        if (err) {
          console.error('Could not connect: ' + err.message);
        } else {
          var message = new C2DMessage(JSON.stringify(body));
          message.ack = 'full';
          message.messageId = "C2D Command";
          console.log('Sending message to device ' + targetDevice + ': ' + message.getData());
          C2DServiceClient.send(targetDevice, message, printResultFor('send'));
        }
      });
}

function printResultFor(op) {
    return function printResult(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}

async function main() {
    // Create the client to connect to the default consumer group of the Event Hub
    const consumerClient = new EventHubConsumerClient(
        "$Default",
        connectionString
    );

    // Create the C2D service client
    C2DServiceClient = C2DClient.fromConnectionString(C2DConnectionString);

    // Subscribe to messages from all partitions as below
    // To subscribe to messages from a single partition, use the overload of the same method.
    consumerClient.subscribe({
        processEvents: updateResources,
        processError: printError,
    });
}

main().catch((error) => {
    console.error("Error running sample:", error);
});
