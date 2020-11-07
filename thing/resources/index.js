const resourcesJson = require('./resources.json');
const events = require('events');

const eventEmitter = new events.EventEmitter;

let handler = {
    //Setter for the proxy of resources file
    set(target, prop, value) {
        //Change the actual value
        target[prop] = value;
        //Emit an event each time changed
        eventEmitter.emit("change", target, prop, value);
    },
    get(target, key) {
        //If object contains nested objects or array, assign a proxy to them recursively as well
        if (['[object Object]', '[object Array]'].indexOf(Object.prototype.toString.call(target[key])) > -1) {
            return new Proxy(target[key], handler);
        }
        else {
            return target[key];
        }
    }
}

const resources = new Proxy(resourcesJson, handler);



module.exports = { resources: resources, resourcesEE: eventEmitter };