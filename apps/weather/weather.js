import { Element, Window } from "../../system/ui/index.js";

export class Weather {
    static about =
        "Currently only supports browser location. Will look into city/ZIP in the future. Your location data is only stored in local storage and passed to the Open-meteo API. May add some more data but plan to keep it simple still.";
    constructor() {
        this.weatherbox = Element("div", { class: "sf-weather" });
        const windowEl = Window(
            "Weather",
            { "Toggle C/F": this.toggleUnits, About: () => alert(Weather.about) },
            this.weatherbox
        );
        this.initWeather();
        if (!windowEl) return;
        document.body.appendChild(windowEl);
        windowEl.show();
    }

    toggleUnits = () => {
        this.units = this.units === "F" ? "C" : "F";
        localStorage.setItem("weather.units", this.units);
        this.getWeather();
    };

    initWeather = () => {
        this.units = localStorage.getItem("weather.units") || "F";
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.lat = position.coords.latitude;
                this.long = position.coords.longitude;
                localStorage.setItem("coords", JSON.stringify({ lat: this.lat, long: this.long }));
                this.getWeather();
                setInterval(this.getWeather, 15 * 60 * 1000);
                window.bus.push("locationUpdated");
            },
            () => {
                this.weatherbox.classList.add("error");
                this.weatherbox.innerHTML = `
                    <p>
                        You'll need to enable location access to get the weather.
                    </p>
                    <p>
                        Your location is only stored in your browser's local storage<br>
                        and only used for weather. We may add a zip code option<br>
                        in the future.
                    </p>
                `;
            }
        );
    };

    getWeather = async () => {
        const response = await fetch(`\
https://api.open-meteo.com/v1/forecast\
?latitude=${this.lat}\
&longitude=${this.long}\
&current=temperature_2m,weather_code,is_day\
&daily=weather_code,temperature_2m_min,temperature_2m_max\
&hourly=temperature_2m,weather_code\
&timezone=auto${this.units === "F" ? "&temperature_unit=fahrenheit" : ""}\
`);
        const weather = await response.json();
        const temp = weather.current.temperature_2m;
        const unit = weather.current_units.temperature_2m;
        const cond = weather.current.weather_code;
        const isDay = weather.current.is_day;
        const low = weather.daily.temperature_2m_min[0];
        const high = weather.daily.temperature_2m_max[0];
        const nextHour = new Date().getHours() + 1;
        // The hourly response always starts from 12am
        const hourly = Array.from(Array(3)).map((_, i) => ({
            time: weather.hourly.time[i + nextHour],
            temp: weather.hourly.temperature_2m[i + nextHour],
            cond: weather.hourly.weather_code[i + nextHour],
        }));
        const daily = Array.from(Array(3)).map((_, i) => ({
            day: weather.daily.time[i + 1],
            high: weather.daily.temperature_2m_max[i + 1],
            low: weather.daily.temperature_2m_min[i + 1],
            cond: weather.daily.weather_code[i + 1],
        }));
        this.weatherbox.innerHTML = "";
        const [icon, text] = Weather.getCondition(cond, isDay);
        this.weatherbox.appendChild(
            Element(
                "div",
                { class: "current" },
                Element(
                    "div",
                    { class: "icon", "aria-label": `Current conditions: ${text}` },
                    icon
                ),
                Element(
                    "div",
                    { class: "temp" },
                    Element("span", { "aria-label": "Current temperature: " }),
                    `${Math.round(temp)}${unit}`
                ),
                Element(
                    "div",
                    { class: "hl" },
                    Element(
                        "div",
                        { "aria-label": `Today's high temperature: ${Math.round(high)}${unit}` },
                        `H: ${Math.round(high)}${unit}`
                    ),
                    Element(
                        "div",
                        { "aria-label": `Today's low temperature: ${Math.round(low)}${unit}` },
                        `L: ${Math.round(low)}${unit}`
                    )
                )
            )
        );
        this.weatherbox.appendChild(
            Element(
                "div",
                { class: "forecast" },
                Element(
                    "div",
                    { class: "hourly" },
                    ...hourly.map((hour) => {
                        const [icon, text] = Weather.getCondition(hour.cond);
                        return Element(
                            "div",
                            { class: "hour-tile" },
                            Element(
                                "div",
                                {},
                                new Date(hour.time)
                                    .toLocaleTimeString("en-US", { hour: "numeric" })
                                    .toLowerCase()
                            ),
                            Element("div", { "aria-label": `Conditions: ${text}` }, icon),
                            Element(
                                "div",
                                {},
                                Element("span", { "aria-label": "Temperature:" }),
                                Math.round(hour.temp) + unit
                            )
                        );
                    })
                ),
                Element(
                    "div",
                    { class: "daily" },
                    ...daily.map((day) => {
                        const [icon, text] = Weather.getCondition(day.cond);
                        return Element(
                            "div",
                            { class: "day-tile" },
                            Element(
                                "div",
                                {},
                                new Date(day.day).toLocaleDateString("en-US", { weekday: "short" })
                            ),
                            Element("div", { "aria-label": `Conditions: ${text}` }, icon),
                            Element(
                                "div",
                                {},
                                Element("span", { "aria-label": "High temperature:" }),
                                `${Math.round(day.high)}${unit}`
                            ),
                            Element(
                                "div",
                                {},
                                Element("span", { "aria-label": "Low temperature:" }),
                                `${Math.round(day.low)}${unit}`
                            )
                        );
                    })
                )
            )
        );
    };

    static getCondition = (condition, isDay) => {
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
                    return ["☀️", "clear"];
                } else {
                    // TODO: moon phases
                    return ["🌛", "clear"];
                }
            case 1:
                return ["🌤️", "partly cloudy"];
            case 2:
                return ["⛅", "mostly cloudy"];
            case 3:
                return ["☁️", "cloudy"];
            case 45:
            case 48:
                return ["🌫️", "foggy"];
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
                return ["🌧️", "rain"];
            case 71:
            case 73:
            case 75:
            case 77:
            case 85:
            case 86:
                return ["🌨️", "snow"];
            case 95:
            case 96:
            case 99:
                return ["🌩️", "thunderstorms"];
        }
    };
}
