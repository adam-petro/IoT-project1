const WebSocket = require("ws");
const resources = require("../resources").resources;
const resourcesEE = require("../resources").resourcesEE;


exports.listen = function (server) {
    const wss = new WebSocket.Server({ server: server });
    console.info("Websocket Server started");

    //Listen for request to open socket connection
    wss.on('connection', (ws, req) => {
        //Get request url
        const url = req.url;
        try {
            //When connection is opened, listen for all changes on the resource file. 
            //Good optimization would be to just listen to changes on the requested resource.
            resourcesEE.on("change", (target, prop, value) => {
                //If requested resource matches the one that was changed in the resource file
                if (target.name && selectResource(url).name && target.name === selectResource(url).name) {
                    ws.send(JSON.stringify(target));
                }

            })
        }
        catch (error) {
            console.log("Unable to observe resource:" + error);
        }
    })

}

//Get what resource requester is asking for.
//Good refactoring would remove the forcycle for javascript functional programming replacement.
function selectResource(url) {
    var parts = url.split('/');
    parts.shift();
    var result = resources;
    for (var i = 0; i < parts.length; i++) {
        result = result[parts[i]];
    }
    return result;
}