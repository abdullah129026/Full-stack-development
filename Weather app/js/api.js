/**
 * api.js — Weather API Layer (OpenWeatherMap)
 * Handles all communication with the OpenWeatherMap Current Weather API.
 * Separation of concerns: no DOM manipulation or data processing here.
 */

const API_KEY = "64c6e27d17cb2ba764c2ffe50d2f6625";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

/**
 * Custom error class for API-specific failures.
 */
export class WeatherAPIError extends Error {
  constructor(message, statusCode = null) {
    super(message);
    this.name = "WeatherAPIError";
    this.statusCode = statusCode;
  }
}

/**
 * Fetches current weather data for a given location.
 * @param {string} location  - City name (e.g. "London" or "London,GB").
 * @param {string} unitGroup - "metric" (Celsius) or "us" (Fahrenheit).
 * @returns {Promise<Object>} Raw JSON payload from OpenWeatherMap API.
 * @throws {WeatherAPIError} On HTTP error or network failure.
 */
export async function fetchWeather(location, unitGroup = "metric") {
  if (!location || !location.trim()) {
    throw new WeatherAPIError("Please enter a location to search.");
  }

  // OWM uses "metric" or "imperial" (not "us")
  const units = unitGroup === "us" ? "imperial" : "metric";

  const url = `${BASE_URL}?q=${encodeURIComponent(
    location.trim()
  )}&appid=${API_KEY}&units=${units}`;

  console.log("[SkyPulse] Fetching:", url);

  let response;

  try {
    response = await fetch(url);
  } catch (networkError) {
    throw new WeatherAPIError(
      "Network error — please check your internet connection.",
      null
    );
  }

  if (!response.ok) {
    let bodyText = "";
    try {
      bodyText = await response.text();
    } catch (_) {}
    console.error(`[SkyPulse] API error ${response.status}:`, bodyText);

    if (response.status === 401) {
      throw new WeatherAPIError(
        "Invalid API key. Please check your key at openweathermap.org — new keys can take up to 2 hours to activate.",
        401
      );
    } else if (response.status === 404) {
      throw new WeatherAPIError(
        `Location "${location}" not found. Try a different city name.`,
        404
      );
    } else if (response.status === 429) {
      throw new WeatherAPIError(
        "Too many requests. Please wait a moment and try again.",
        429
      );
    } else {
      throw new WeatherAPIError(
        `API error (${response.status}). Please try again.`,
        response.status
      );
    }
  }

  const data = await response.json();
  return data;
}
