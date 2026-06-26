/**
 * dataProcessor.js — Weather Data Processing Layer (OpenWeatherMap)
 * Pure functions only. No side effects, no DOM access, no API calls.
 * Transforms raw OpenWeatherMap JSON payload into a clean, UI-ready object.
 *
 * OWM Current Weather response shape (relevant fields):
 * {
 *   name: "London",
 *   sys:  { country: "GB", sunrise: <unix>, sunset: <unix> },
 *   weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
 *   main: { temp, feels_like, humidity, pressure, temp_min, temp_max },
 *   wind: { speed, deg },
 *   visibility: 10000,   // metres
 *   clouds: { all: 10 }, // %
 *   timezone: 3600,      // UTC offset in seconds
 *   dt: <unix>
 * }
 */

// ─── Icon / Theme Mapping ─────────────────────────────────────────────────────

/**
 * Maps OWM icon codes to our internal CSS theme names.
 * OWM icons: 01d/n, 02d/n, 03d/n, 04d/n, 09d/n, 10d/n, 11d/n, 13d/n, 50d/n
 * @param {string} icon - OWM icon code.
 * @returns {string} CSS theme key.
 */
export function mapIconToTheme(icon) {
  if (!icon) return "default";
  const code = icon.slice(0, 2); // strip d/n suffix
  const isNight = icon.endsWith("n");

  const themeMap = {
    "01": isNight ? "clear-night" : "sunny",
    "02": isNight ? "partly-cloudy-night" : "partly-cloudy",
    "03": "cloudy",
    "04": "cloudy",
    "09": "rainy",
    "10": "rainy",
    "11": "stormy",
    "13": "snowy",
    "50": "foggy",
  };

  return themeMap[code] || "default";
}

/**
 * Maps OWM icon codes to display emojis.
 * @param {string} icon - OWM icon code.
 * @returns {string} Emoji character.
 */
export function mapIconToEmoji(icon) {
  if (!icon) return "🌡️";
  const code = icon.slice(0, 2);
  const isNight = icon.endsWith("n");

  const emojiMap = {
    "01": isNight ? "🌙" : "☀️",
    "02": isNight ? "🌤️" : "⛅",
    "03": "🌥️",
    "04": "☁️",
    "09": "🌧️",
    "10": isNight ? "🌧️" : "🌦️",
    "11": "⛈️",
    "13": "❄️",
    "50": "🌫️",
  };

  return emojiMap[code] || "🌡️";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Converts a Unix timestamp + UTC offset to a 12-hour time string.
 * @param {number} unixTs   - Unix timestamp (seconds).
 * @param {number} tzOffset - UTC offset in seconds (from OWM `timezone` field).
 * @returns {string} e.g. "6:23 AM"
 */
function unixToLocalTime(unixTs, tzOffset) {
  if (unixTs == null) return "—";
  const date = new Date((unixTs + tzOffset) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${h}:${String(minutes).padStart(2, "0")} ${ampm}`;
}

/**
 * Estimates dew point from temperature (°C) and relative humidity.
 * Uses the Magnus approximation formula.
 * @param {number} tempC - Temperature in Celsius.
 * @param {number} rh    - Relative humidity (0–100).
 * @returns {number} Dew point in Celsius (rounded).
 */
function calcDewPoint(tempC, rh) {
  if (tempC == null || rh == null) return null;
  const a = 17.625;
  const b = 243.04;
  const alpha = Math.log(rh / 100) + (a * tempC) / (b + tempC);
  return Math.round((b * alpha) / (a - alpha));
}

// ─── Main Processor ───────────────────────────────────────────────────────────

/**
 * Processes raw OpenWeatherMap API data into a clean weather object.
 * @param {Object} raw  - Raw JSON from OWM current weather endpoint.
 * @param {string} unit - "metric" or "us".
 * @returns {Object} Normalised weather data object.
 */
export function processWeatherData(raw, unit = "metric") {
  const main    = raw.main    || {};
  const wind    = raw.wind    || {};
  const sys     = raw.sys     || {};
  const weather = (raw.weather || [])[0] || {};
  const tzOffset = raw.timezone || 0;

  const unitLabel = unit === "metric" ? "°C" : "°F";
  const windUnit  = unit === "metric" ? "km/h" : "mph";

  // OWM returns wind speed in m/s for metric — convert to km/h
  // For imperial it returns mph directly
  const rawWindSpeed = wind.speed != null ? wind.speed : null;
  const windSpeed =
    rawWindSpeed != null
      ? unit === "metric"
        ? Math.round(rawWindSpeed * 3.6)   // m/s → km/h
        : Math.round(rawWindSpeed)          // mph already
      : null;

  // Visibility: OWM returns metres — convert to km
  const visibilityKm =
    raw.visibility != null ? Math.round(raw.visibility / 1000) : null;

  // Dew point: calculate from temp (always in metric base) and humidity
  // For imperial we'll store in °C internally and convert in convertUnits()
  const tempC =
    unit === "metric"
      ? main.temp
      : ((main.temp - 32) * 5) / 9; // convert back for formula
  const dewPointC = calcDewPoint(tempC, main.humidity);
  const dewPoint =
    unit === "metric"
      ? dewPointC != null ? Math.round(dewPointC) : null
      : dewPointC != null ? Math.round((dewPointC * 9) / 5 + 32) : null;

  // Capitalise description
  const description =
    weather.description
      ? weather.description.charAt(0).toUpperCase() + weather.description.slice(1)
      : "—";

  return {
    // Location
    location: `${raw.name || "Unknown"}${sys.country ? `, ${sys.country}` : ""}`,

    // Temperature
    temp:      main.temp      != null ? Math.round(main.temp)      : null,
    feelsLike: main.feels_like != null ? Math.round(main.feels_like) : null,
    unitLabel,
    tempUnit: unit,

    // Conditions
    conditions: description,
    icon:  weather.icon || "01d",
    emoji: mapIconToEmoji(weather.icon),
    theme: mapIconToTheme(weather.icon),

    // Atmosphere
    humidity:   main.humidity != null ? Math.round(main.humidity) : null,
    windSpeed,
    windUnit,
    visibility: unit === "metric" ? visibilityKm : visibilityKm, // same (km for both; UI shows "km")
    uvIndex:    null,   // OWM free tier doesn't expose UV in current weather
    uvLabel:    "N/A",
    dewPoint,

    // Time
    observationTime: unixToLocalTime(raw.dt, tzOffset),

    // Sun
    sunrise: unixToLocalTime(sys.sunrise, tzOffset),
    sunset:  unixToLocalTime(sys.sunset,  tzOffset),

    // Raw wind (m/s) cached for unit conversion
    _rawWindMps: rawWindSpeed,
    _dewPointC:  dewPointC,
    _visKm:      visibilityKm,
  };
}

// ─── Unit Converter ───────────────────────────────────────────────────────────

/**
 * Converts a processed weather object to a different unit system.
 * Uses cached raw values — no new API call needed.
 * @param {Object} data     - Processed weather data.
 * @param {string} toUnit   - "metric" or "us".
 * @returns {Object} Converted weather data object.
 */
export function convertUnits(data, toUnit) {
  if (data.tempUnit === toUnit) return data;

  const toF  = (c) => (c != null ? Math.round((c * 9) / 5 + 32) : null);
  const toC  = (f) => (f != null ? Math.round(((f - 32) * 5) / 9) : null);

  if (toUnit === "us") {
    return {
      ...data,
      temp:      toF(data.temp),
      feelsLike: toF(data.feelsLike),
      dewPoint:  data._dewPointC != null ? Math.round((data._dewPointC * 9) / 5 + 32) : null,
      windSpeed: data._rawWindMps != null ? Math.round(data._rawWindMps * 2.23694) : null, // m/s → mph
      windUnit:  "mph",
      unitLabel: "°F",
      tempUnit:  "us",
    };
  } else {
    return {
      ...data,
      temp:      toC(data.temp),
      feelsLike: toC(data.feelsLike),
      dewPoint:  data._dewPointC != null ? Math.round(data._dewPointC) : null,
      windSpeed: data._rawWindMps != null ? Math.round(data._rawWindMps * 3.6) : null, // m/s → km/h
      windUnit:  "km/h",
      unitLabel: "°C",
      tempUnit:  "metric",
    };
  }
}
