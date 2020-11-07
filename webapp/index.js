const httpServer = require('./servers/http');
const wsServer = require('./servers/websockets');
const azurePlugin = require("./plugins/azureIoTHubConnector");

let server;
const main = async () => {

    server = httpServer.listen(8080, () => {
        console.log("server listening on the port " + 8080);
        wsServer.listen(server);
    })
}

process.on('SIGINT', function () {
    server.close();
    process.exit();
});
main();