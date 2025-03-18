import { Calendar } from "../../apps/calendar/calendar.js";
import { Weather } from "../../apps/weather/weather.js";
import { Element } from "../ui/element.js";
import { Menu } from "../ui/menu.js";
import { UnstyledButton } from "../ui/unstyled-button.js";

let coords, weatherbox, datebox, timebox;

export const StatusBar = () => {
    const [systemMenu, toggleSystemMenu] = Menu({ Settings: () => alert("Settings!") });
    weatherbox = UnstyledButton({ class: "weather" }, () => new Weather(initWeather));
    initWeather();
    datebox = UnstyledButton({ class: "datebox" }, () => new Calendar());
    timebox = Element("div", { class: "timebox" });
    getDateTime();
    setInterval(getDateTime, 60 * 1000);
    return Element(
        "div",
        { class: "sf-statusbar" },
        UnstyledButton(
            { class: "system-menu" },
            toggleSystemMenu,
            Element("img", { src: "system/ui/images/system-menu.png" })
        ),
        Element("div", { class: "rhs" }, weatherbox, datebox, timebox),
        systemMenu
    );
};

const initWeather = () => {
    coords = JSON.parse(localStorage.getItem("coords"));
    if (coords === null) {
        weatherbox.innerText = "--°F ❓";
        return;
    }
    getWeather();
    setInterval(getWeather, 15 * 60 * 1000);
};

const getWeather = async () => {
    const units = localStorage.getItem("weather.units") || "F";
    const response = await fetch(`\
https://api.open-meteo.com/v1/forecast\
?latitude=${coords.lat}&longitude=${coords.long}\
&current=temperature_2m,weather_code,is_day\
&timezone=auto${units === "F" ? "&temperature_unit=fahrenheit" : ""}\
`);
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
