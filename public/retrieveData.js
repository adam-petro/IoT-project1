fetch("/pi").then(data => data.json()).then(data => buildUI(data));

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function buildUI(resources) {
    //Main div to contain sensors and actuators
    const main = document.getElementById("main-section");

    const sensors = resources.sensors;
    const actuators = resources.actuators;

    // Sensors
    const sensorContainer = document.createElement("div");
    sensorContainer.className = "row";
    sensorContainer.setAttribute("style", " margin: 20px;");
    main.appendChild(sensorContainer);

    Object.keys(sensors).forEach((key) => {
        if (key === "dht") {
            buildSensor(key + "-temperature", sensors[key].temperature, sensorContainer);
            buildSensor(key + "-humidity", sensors[key].humidity, sensorContainer);
        } else {
            buildSensor(key, sensors[key], sensorContainer);
        }
    })

    // Actuators
    Object.keys(actuators).forEach((key) => {
        buildActuator(key, actuators[key], main);
    })
}

function buildSensor(identifier, sensor, sensorContainer) {
    container = document.createElement("div");
    container.className = "card col-3";
    sensorContainer.appendChild(container);

    let picture = new Image();
    picture.className = "card-img-top sysinfo-icon";
    switch (identifier) {
        case "cpuTemperature":
            picture.src = "assets/speedometer.png";
            break;
        case "dht-temperature":
            picture.src = "assets/thermometer.png";
            break;
        case "dht-humidity":
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

    // Initialise state
    updateSensorInfo(identifier, sensor);

    // Setup websocket
    webSocket = new WebSocket("ws://" + location.host + "/pi/sensors/" + identifier.replace("-", "/"));
    webSocket.onmessage = ((message) => {
        updateSensorInfo(identifier, JSON.parse(message.data))
    });
}

function updateSensorInfo(identifier, sensor) {
    let valueDescription = document.getElementById(identifier + "-value-description");
    let descriptiveString;

    switch (identifier) {
        case "cpuTemperature":
            descriptiveString = "The current CPU temperature is ";
            break;
        case "dht-temperature":
            descriptiveString = "The current external temperature is ";
            break;
        case "dht-humidity":
            descriptiveString = "The current external humidity is ";
            break;
        case "distance":
            descriptiveString = "The current measured distance is ";
            break;
    }

    valueDescription.innerHTML = descriptiveString + round(sensor.value, 2) + sensor.unit;
}

function buildActuator(key, actuator, main) {
    if (key.startsWith("leds")) {
        const ledsContainer = document.createElement("div");
        ledsContainer.className = "row";
        ledsContainer.setAttribute("style", " margin: 20px;");
        main.appendChild(ledsContainer);

        const leds = actuator;

        Object.keys(leds).forEach((led) => {

            container = document.createElement("div");
            container.className = "card col-3";
            ledsContainer.appendChild(container);

            let picture = new Image();
            picture.className = "card-img-top sysinfo-icon";
            picture.src = "assets/bulb.png";
            picture.id = key + "-" + led + "-picture";
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
            value.id = key + "-" + led + "-value-description";

            let button = document.createElement("button");
            button.className = "btn btn-secondary";
            button.innerText = "Toggle";
            button.addEventListener("click", () => {
                fetch("/pi/actuators/leds/" + led, { method: "PUT", body: { "value": undefined } })
            })
            body.appendChild(button);

            // Initialise state
            updateLedInfo(key + "-" + led, leds[led].value);

            // Setup websocket
            webSocket = new WebSocket("ws://" + location.host + "/pi/actuators/leds/" + led);
            webSocket.onmessage = ((message) => {
                console.log(message);
                updateLedInfo(key + "-" + led, JSON.parse(message.data).value)
            });
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