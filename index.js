const httpServer = require('./servers/http');
const wsServer = require('./servers/websockets');
const resources = require('./resources').resources;

let cpuPlugin = require("./plugins/internal/cpuPlugin");
let dhtPlugin = require("./plugins/internal/dhtPlugin");
let distancePlugin = require("./plugins/internal/distancePlugin");
let ledsPlugin = require("./plugins/internal/ledsPlugin");

cpuPlugin.start(2000);
dhtPlugin.start(2000);
distancePlugin.start(2000);
ledsPlugin.start();


let server;
const main = async () => {

    server = httpServer.listen(resources.pi.port, () => {
        console.log("server listening on the port " + resources.pi.port);
        wsServer.listen(server);
    })
}

process.on('SIGINT', function () {
    dhtPlugin.stop();
    cpuPlugin.stop();
    distancePlugin.stop();
    ledsPlugin.stop();
    setTimeout(() => {
        console.log("exiting...");
        server.close();
        process.exit();
    }, 5000)
});
main();