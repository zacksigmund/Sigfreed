import { Calendar } from "../calendar/calendar.js";
import { Element } from "../ui/element.js";
import { Weather } from "../weather/weather.js";

let lat, long;
let weatherbox, datebox, timebox;

export const StatusBar = () => {
    weatherbox = Element("button", { class: "weather" });
    weatherbox.addEventListener("click", () => new Weather());
    initWeather();
    datebox = Element("button", { class: "datebox" });
    datebox.addEventListener("click", () => new Calendar());
    timebox = Element("div", { class: "timebox" });
    getDateTime();
    setInterval(getDateTime, 60 * 1000);
    return Element(
        "div",
        { class: "sf-statusbar" },
        weatherbox,
        Element("div", { class: "datetimebox" }, datebox, timebox)
    );
};

const initWeather = () => {
    // TODO: give context to location prompt
    navigator.geolocation.getCurrentPosition(
        (position) => {
            lat = position.coords.latitude;
            long = position.coords.longitude;
            getWeather();
            setInterval(getWeather, 15 * 60 * 1000);
        },
        () => {
            weatherbox.innerText = "--°F ❓";
        }
    );
};

const getWeather = async () => {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,weather_code,is_day&timezone=auto&forecast_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`
    );
    const weather = await response.json();
    const temp = weather.hourly.temperature_2m[0];
    const cond = weather.hourly.weather_code[0];
    const isDay = weather.hourly.is_day[0];
    weatherbox.innerText = `${Math.round(temp)}${
        weather.hourly_units.temperature_2m
    } ${getConditionIcon(cond, isDay)}`;
};

const getConditionIcon = (condition, isDay) => {
    /*
        0	Clear sky
        1, 2, 3	Mainly clear, partly cloudy, and overcast
        45, 48	Fog and depositing rime fog
        51, 53, 55	Drizzle: Light, moderate, and dense intensity
        56, 57	Freezing Drizzle: Light and dense intensity
        61, 63, 65	Rain: Slight, moderate and heavy intensity
        66, 67	Freezing Rain: Light and heavy intensity
        71, 73, 75	Snow fall: Slight, moderate, and heavy intensity
        77	Snow grains
        80, 81, 82	Rain showers: Slight, moderate, and violent
        85, 86	Snow showers slight and heavy
        95 *	Thunderstorm: Slight or moderate
        96, 99 *	Thunderstorm with slight and heavy hail
    */
    switch (condition) {
        case 0:
            if (isDay) {
                return "☀️";
            } else {
                // TODO: moon phases
                return "🌛";
            }
        case 1:
            return "🌤️";
        case 2:
            return "⛅";
        case 3:
            return "☁️";
        case 45:
        case 48:
            return "🌫️";
        case 51:
        case 53:
        case 55:
        case 57:
        case 57:
        case 61:
        case 63:
        case 65:
        case 66:
        case 67:
        case 80:
        case 81:
        case 82:
            return "🌧️";
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86:
            return "🌨️";
        case 95:
        case 96:
        case 99:
            return "🌩️";
    }
};

const getDateTime = () => {
    const date = new Date();
    datebox.innerHTML =
        date.toLocaleDateString("en-US", {
            weekday: "short",
        }) +
        " " +
        date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    timebox.innerHTML = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
    });
};
