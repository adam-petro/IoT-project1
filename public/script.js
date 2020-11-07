const eventSource = new EventSource('/data');

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

eventSource.addEventListener('connected', (e) => {
    processState(JSON.parse(event.data));
});

document.getElementById("toggle-led").addEventListener("click", function () {

    fetch("led/toggle").then((response) => response.json()).then((response) => {
        console.log(response);
        processState(response.state);
    }).catch((e) => { console.log(e) });

});

function processState(state) {
    const today = new Date();
    let updateTime = "  (" + today.getHours() + "h:" + today.getMinutes() + "m:" + today.getSeconds() + "s)";
    document.getElementById("cpu-temp-text").innerText = (state.cpuTemperature.main) + "°C" + updateTime;

    if (state.ledOn) {
        document.getElementById("led-icon").style.webkitFilter = "invert(50%) sepia(10%) saturate(10000%) hue-rotate(180deg)";
    }
    else {
        document.getElementById("led-icon").style.webkitFilter = "";
    }

    document.getElementById("outdoor-temp-text").innerText = round(state.sensorTemperature, 3) + "°C";
    document.getElementById("outdoor-humidity-text").innerText = round(state.sensorHumidity, 3) + "%" + updateTime;

    document.getElementById("radar-distance-text").innerText = round(state.radarDistance, 3) + " cm" + updateTime;
}