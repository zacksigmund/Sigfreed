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
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,weather_code,is_day&timezone=auto&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`
    );
    const weather = await response.json();
    const temp = weather.current.temperature_2m;
    const cond = weather.current.weather_code;
    const isDay = weather.current.is_day;
    weatherbox.innerText = `${Math.round(temp)}${
        weather.current_units.temperature_2m
    } ${Weather.getConditionIcon(cond, isDay)}`;
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
