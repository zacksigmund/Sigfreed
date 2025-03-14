import { Element } from "../../system/ui/element.js";
import { Window } from "../../system/ui/window.js";

export class Weather {
    constructor(callback) {
        this.weatherbox = Element("div", { class: "sf-weather" });
        const windowEl = Window("Weather", {}, this.weatherbox);
        this.initWeather(callback);
        if (!windowEl) return;
        document.body.appendChild(windowEl);
    }

    initWeather = (callback) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.lat = position.coords.latitude;
                this.long = position.coords.longitude;
                localStorage.setItem("coords", JSON.stringify({ lat: this.lat, long: this.long }));
                this.getWeather();
                setInterval(this.getWeather, 15 * 60 * 1000);
                callback?.();
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
&timezone=auto&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch\
`);
        const weather = await response.json();
        const temp = weather.current.temperature_2m;
        const unit = weather.current_units.temperature_2m;
        const cond = weather.current.weather_code;
        const isDay = weather.current.is_day;
        const low = weather.daily.temperature_2m_min[0];
        const high = weather.daily.temperature_2m_max[0];
        const hourly = Array.from(Array(3)).map((_, i) => ({
            time: weather.hourly.time[i],
            temp: weather.hourly.temperature_2m[i],
            cond: weather.hourly.weather_code[i],
        }));
        const daily = Array.from(Array(3)).map((_, i) => ({
            day: weather.daily.time[i + 1],
            high: weather.daily.temperature_2m_max[i + 1],
            low: weather.daily.temperature_2m_min[i + 1],
            cond: weather.daily.weather_code[i + 1],
        }));
        this.weatherbox.innerHTML = "";
        this.weatherbox.appendChild(
            Element(
                "div",
                { class: "current" },
                Element("div", { class: "icon" }, Weather.getConditionIcon(cond, isDay)),
                Element("div", { class: "temp" }, `${Math.round(temp)}${unit}`),
                Element(
                    "div",
                    { class: "hl" },
                    Element("div", {}, `H: ${Math.round(high)}${unit}`),
                    Element("div", {}, `L: ${Math.round(low)}${unit}`)
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
                    ...hourly.map((hour) =>
                        Element(
                            "div",
                            { class: "hour-tile" },
                            Element(
                                "div",
                                {},
                                new Date(hour.time)
                                    .toLocaleTimeString("en-US", { hour: "numeric" })
                                    .toLowerCase()
                            ),
                            Element("div", {}, Weather.getConditionIcon(hour.cond)),
                            Element("div", {}, Math.round(hour.temp) + unit)
                        )
                    )
                ),
                Element(
                    "div",
                    { class: "daily" },
                    ...daily.map((day) =>
                        Element(
                            "div",
                            { class: "day-tile" },
                            Element(
                                "div",
                                {},
                                new Date(day.day).toLocaleDateString("en-US", { weekday: "short" })
                            ),
                            Element("div", {}, Weather.getConditionIcon(day.cond)),
                            Element("div", {}, `${Math.round(day.high)}${unit}`),
                            Element("div", {}, `${Math.round(day.low)}${unit}`)
                        )
                    )
                )
            )
        );
    };

    static getConditionIcon = (condition, isDay) => {
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
}
