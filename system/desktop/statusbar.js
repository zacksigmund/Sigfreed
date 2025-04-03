import { Calendar } from "../../apps/calendar/calendar.js";
import { Settings } from "../../apps/settings/settings.js";
import { Weather } from "../../apps/weather/weather.js";
import { Element } from "../ui/element.js";
import { Menu } from "../ui/menu.js";
import { UnstyledButton } from "../ui/unstyled-button.js";

let coords, weatherbox, datebox, timebox;

export const StatusBar = () => {
    const [systemMenu, toggleSystemMenu] = Menu([
        ["Settings", ",", () => window.windowManager.open(Settings)],
    ]);
    document.addEventListener("keydown", (event) => {
        if (event.key === "," && event.altKey) {
            window.windowManager.open(Settings);
        }
    });
    weatherbox = UnstyledButton({ class: "weather" }, () => window.windowManager.open(Weather));
    window.bus.on("locationUpdated", initWeather);
    initWeather();
    datebox = UnstyledButton({ class: "datebox" }, () => window.windowManager.open(Calendar));
    timebox = Element("div", { class: "timebox" });
    getDateTime();
    window.bus.on("settingsChanged", getDateTime);
    return Element(
        "div",
        { class: "sf-statusbar" },
        UnstyledButton(
            {
                class: "system-menu",
                "aria-label": "System menu",
                "aria-haspopup": "menu",
                "aria-expanded": false,
            },
            toggleSystemMenu,
            Element("img", { src: "system/ui/images/system-menu.png" })
        ),
        systemMenu,
        Element("div", { class: "rhs" }, weatherbox, datebox, timebox)
    );
};

const initWeather = () => {
    coords = JSON.parse(localStorage.getItem("coords"));
    if (coords === null) {
        weatherbox.innerHTML =
            "<span aria-label='Weather unknown; location unavailable'>--°F ❓</span>";
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
    const [condIcon, condText] = Weather.getCondition(cond, isDay);
    weatherbox.innerHTML = `<span aria-label="Current temperature: "></span>${Math.round(temp)}${
        weather.current_units.temperature_2m
    } <span aria-label="Current conditions: ${condText}">${condIcon}</span>`;
};

const getDateTime = () => {
    const is24h = JSON.parse(localStorage.getItem("settings.24h")) ?? false;
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
        hour12: !is24h,
        hour: "numeric",
        minute: "numeric",
    });
    setTimeout(getDateTime, (60 - date.getSeconds()) * 1000);
};
