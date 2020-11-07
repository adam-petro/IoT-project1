
fetch("/").then(data => data.json()).then(data => {
    Object.keys(data).forEach((deviceId) => {
        buildUiOnePi(deviceId, data[deviceId]);
    })

    // Setup websocket
    webSocket = new WebSocket("ws://" + location.host + "/");
    webSocket.onmessage = ((message) => {
        let data = JSON.parse(message.data);

        Object.keys(data).forEach((deviceId) => {
            buildUiOnePi(deviceId, data[deviceId]);
        })
    });
});

function buildUiOnePi(deviceName, deviceData) {
    let deviceContainer = document.getElementById(deviceName + "-container");
    if (deviceContainer === null) {
        const main = document.getElementById("main-section");
        deviceContainer = document.createElement("div");
        deviceContainer.id = deviceName + "-container";
        deviceContainer.className = "flex-column";
        deviceContainer.setAttribute("style", " margin: 20px;");
        main.appendChild(deviceContainer);

        let titleRow = document.createElement("div");
        titleRow.className = "row";
        titleRow.setAttribute("style", " margin: 20px;");
        deviceContainer.appendChild(titleRow);
        let title = document.createElement("h2");
        title.innerText = deviceName.replaceAll("-", " ");
        titleRow.appendChild(title);
    }

    buildSensorsOnePi(deviceName, deviceData);
    buildActuatorsOnePi(deviceName, deviceData);
}

function buildSensorsOnePi(deviceName, deviceData) {
    let sensorContainer = document.getElementById(deviceName + "-sensor-container");

    let sensorDataList = deviceData.sensors;

    if (sensorContainer === null) {
        const deviceContainer = document.getElementById(deviceName + "-container");
        sensorContainer = document.createElement("div");
        sensorContainer.id = deviceName + "-sensor-container";
        sensorContainer.className = "row";
        sensorContainer.setAttribute("style", " margin: 20px;");
        deviceContainer.appendChild(sensorContainer);


        Object.keys(sensorDataList).forEach((key) => {
            buildSensor(deviceName + "-sensor-" + key, sensorDataList[key], sensorContainer, key);
        });
    }

    Object.keys(sensorDataList).forEach((key) => {
        updateSensorInfo(deviceName + "-sensor-" + key, sensorDataList[key], key);
    });
    
}

function buildActuatorsOnePi(deviceName, deviceData) {
    let actuatorContainer = document.getElementById(deviceName + "-actuator-container");
    let fromNew = (actuatorContainer === null);

    let actuatorDataList = deviceData.actuators;

    if (actuatorContainer === null) {
        const deviceContainer = document.getElementById(deviceName + "-container");
        actuatorContainer = document.createElement("div");
        actuatorContainer.id = deviceName + "-actuator-container";
        actuatorContainer.className = "flex-column";
        deviceContainer.appendChild(actuatorContainer);
    }

    Object.keys(actuatorDataList).forEach((key) => {
        buildActuator(deviceName + "-actuator-" + key, actuatorDataList[key], actuatorContainer, fromNew, deviceName);
    });

}

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

// function buildUI(resources) {
//     //Main div to contain sensors and actuators
    

//     const sensors = resources.sensors;
//     const actuators = resources.actuators;

//     // Actuators
//     Object.keys(actuators).forEach((key) => {
//         buildActuator(key, actuators[key], main);
//     })
// }

function buildSensor(identifier, sensor, sensorContainer, key) {
    container = document.createElement("div");
    container.className = "card col-3";
    sensorContainer.appendChild(container);

    let picture = new Image();
    picture.className = "card-img-top sysinfo-icon";
    switch (key) {
        case "cpuTemperature":
            picture.src = "assets/speedometer.png";
            break;
        case "dhtTemperature":
            picture.src = "assets/thermometer.png";
            break;
        case "dhtHumidity":
            picture.src = "assets/drop.png";
            break;
        case "distance":
            picture.src = "assets/radar-tracking.png";
            break;

    }
    container.appendChild(picture);

    let body = document.createElement("div");
    body.className = "card-body";
    container.appendChild(body);

    let title = document.createElement("h4");
    body.appendChild(title);
    title.className = "card-title";
    title.innerHTML = sensor.name;

    let value = document.createElement("p");
    body.appendChild(value);
    value.id = identifier + "-value-description";
}

function updateSensorInfo(identifier, sensor, key) {
    let valueDescription = document.getElementById(identifier + "-value-description");
    let descriptiveString;

    switch (key) {
        case "cpuTemperature":
            descriptiveString = "The current CPU temperature is ";
            break;
        case "dhtTemperature":
            descriptiveString = "The current external temperature is ";
            break;
        case "dhtHumidity":
            descriptiveString = "The current external humidity is ";
            break;
        case "distance":
            descriptiveString = "The current measured distance is ";
            break;
    }

    valueDescription.innerHTML = descriptiveString + round(sensor.value, 2) + sensor.unit;
}

function buildActuator(identifier, actuator, actuatorContainer, fromNew, deviceId) {
    if (identifier.includes("leds")) {
        let ledsContainer;
        if (fromNew) {
            ledsContainer = document.createElement("div");
            ledsContainer.className = "row";
            ledsContainer.setAttribute("style", " margin: 20px;");
            ledsContainer.id = identifier + "-container";
            actuatorContainer.appendChild(ledsContainer);
        } else {
            ledsContainer = document.getElementById(identifier + "-container");
        }        

        const leds = actuator;

        Object.keys(leds).forEach((led) => {
            if (fromNew) {
                container = document.createElement("div");
                container.className = "card col-3";
                ledsContainer.appendChild(container);

                let picture = new Image();
                picture.className = "card-img-top sysinfo-icon";
                picture.src = "assets/bulb.png";
                picture.id = identifier + "-" + led + "-picture";
                container.appendChild(picture);

                let body = document.createElement("div");
                body.className = "card-body";
                container.appendChild(body);

                let title = document.createElement("h4");
                body.appendChild(title);
                title.className = "card-title";
                title.innerHTML = leds[led].name;

                let value = document.createElement("p");
                body.appendChild(value);
                value.id = identifier + "-" + led + "-value-description";

                let button = document.createElement("button");
                button.className = "btn btn-secondary";
                button.innerText = "Toggle";
                button.addEventListener("click", () => {
                    fetch("/" + deviceId + "/actuators/leds/" + led, { method: "PUT", body: { "value": undefined } })
                })
                body.appendChild(button);
            }

            updateLedInfo(identifier + "-" + led, leds[led].value);
            
        })
    }
}

function updateLedInfo(identifier, value) {
    let picture = document.getElementById(identifier + "-picture");
    let valueDescription = document.getElementById(identifier + "-value-description");

    if (value) {
        picture.style.webkitFilter = "invert(50%) sepia(10%) saturate(10000%) hue-rotate(180deg)";
    }
    else {
        picture.style.webkitFilter = "";
    }

    valueDescription.innerHTML = "The LED is <b>" + (value === true ? 'on' : 'off') + "</b>";
}