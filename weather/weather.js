import { Element } from "../ui/element.js";
import { Window } from "../ui/window.js";

export class Weather {
    constructor() {
        this.weatherbox = Element("div", { class: "sf-weather" });
        const windowEl = Window("Weather", {}, this.weatherbox);
        this.initWeather();
        if (!windowEl) return;
        document.body.appendChild(windowEl);
    }

    initWeather = () => {
        // TODO: give context to location prompt
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.lat = position.coords.latitude;
                this.long = position.coords.longitude;
                this.getWeather();
                setInterval(this.getWeather, 15 * 60 * 1000);
            },
            () => {
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
&daily=temperature_2m_min,temperature_2m_max\
&timezone=auto&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch\
`);
        this.weatherbox.innerHTML = "";
        const weather = await response.json();
        const temp = weather.current.temperature_2m;
        const unit = weather.current_units.temperature_2m;
        const cond = weather.current.weather_code;
        const isDay = weather.current.is_day;
        const low = weather.daily.temperature_2m_min[0];
        const high = weather.daily.temperature_2m_max[0];
        this.weatherbox.appendChild(
            Element(
                "div",
                {},
                Element("div", {}, ` ${Weather.getConditionIcon(cond, isDay)}`),
                Element("div", {}, `${Math.round(temp)}${unit}`),
                Element("div", {}, `H: ${Math.round(high)} L: ${Math.round(low)}`)
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
