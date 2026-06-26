/**
 * ui.js — DOM Manipulation & UI State Layer
 * All DOM reads/writes happen here. No API calls. No business logic.
 */

// ─── Element References ───────────────────────────────────────────────────────

const loadingOverlay = document.getElementById("loading-overlay");
const weatherCard = document.getElementById("weather-card");
const errorToast = document.getElementById("error-toast");
const errorMessage = document.getElementById("error-message");

const locationEl = document.getElementById("location-name");
const observationTimeEl = document.getElementById("observation-time");
const conditionEmojiEl = document.getElementById("condition-emoji");
const conditionTextEl = document.getElementById("condition-text");
const temperatureEl = document.getElementById("temperature");
const unitLabelEl = document.getElementById("unit-label");
const feelsLikeEl = document.getElementById("feels-like");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("wind-speed");
const windUnitEl = document.getElementById("wind-unit");
const uvIndexEl = document.getElementById("uv-index");
const uvLabelEl = document.getElementById("uv-label");
const visibilityEl = document.getElementById("visibility");
const dewPointEl = document.getElementById("dew-point");
const sunriseEl = document.getElementById("sunrise");
const sunsetEl = document.getElementById("sunset");

// ─── Loading State ────────────────────────────────────────────────────────────

/**
 * Shows the loading spinner overlay and hides the card.
 */
export function showLoading() {
  loadingOverlay.classList.add("visible");
  weatherCard.classList.remove("visible");
  hideError();
}

/**
 * Hides the loading spinner overlay.
 */
export function hideLoading() {
  loadingOverlay.classList.remove("visible");
}

// ─── Error Handling ───────────────────────────────────────────────────────────

/**
 * Shows an error toast with a given message.
 * Auto-dismisses after 5 seconds.
 * @param {string} message - Human-friendly error string.
 */
export function showError(message) {
  errorMessage.textContent = message;
  errorToast.classList.add("visible");

  // Clear any existing auto-dismiss timer
  if (errorToast._dismissTimer) clearTimeout(errorToast._dismissTimer);

  errorToast._dismissTimer = setTimeout(() => {
    hideError();
  }, 5000);
}

/**
 * Hides the error toast.
 */
export function hideError() {
  errorToast.classList.remove("visible");
}

// ─── Theme / Conditional Styling ─────────────────────────────────────────────

// All known theme classes to remove before applying a new one
const THEME_CLASSES = [
  "theme-sunny",
  "theme-clear-night",
  "theme-partly-cloudy",
  "theme-partly-cloudy-night",
  "theme-cloudy",
  "theme-foggy",
  "theme-windy",
  "theme-rainy",
  "theme-stormy",
  "theme-snowy",
  "theme-sleet",
  "theme-default",
];

/**
 * Applies a weather-condition-based theme class to <body>.
 * @param {string} theme - Theme key from dataProcessor.mapIconToTheme().
 */
export function applyConditionTheme(theme) {
  document.body.classList.remove(...THEME_CLASSES);
  document.body.classList.add(`theme-${theme}`);
}

// ─── Render Weather ───────────────────────────────────────────────────────────

/**
 * Populates the weather card with processed data and reveals it.
 * @param {Object} data - Processed weather object from dataProcessor.js.
 */
export function renderWeather(data) {
  // Apply background theme
  applyConditionTheme(data.theme);

  // Location & time
  locationEl.textContent = data.location;
  observationTimeEl.textContent = `Updated at ${data.observationTime}`;

  // Main condition
  conditionEmojiEl.textContent = data.emoji;
  conditionTextEl.textContent = data.conditions;

  // Temperature
  temperatureEl.textContent = data.temp != null ? data.temp : "—";
  unitLabelEl.textContent = data.unitLabel;

  // Feels like
  feelsLikeEl.textContent =
    data.feelsLike != null ? `${data.feelsLike}${data.unitLabel}` : "—";

  // Stats grid
  humidityEl.textContent = data.humidity != null ? `${data.humidity}%` : "—";
  windSpeedEl.textContent =
    data.windSpeed != null ? data.windSpeed : "—";
  windUnitEl.textContent = data.windUnit;
  uvIndexEl.textContent = data.uvIndex != null ? data.uvIndex : "—";
  uvLabelEl.textContent = data.uvLabel;
  visibilityEl.textContent =
    data.visibility != null ? `${data.visibility} km` : "—";
  dewPointEl.textContent =
    data.dewPoint != null ? `${data.dewPoint}${data.unitLabel}` : "—";

  // Sunrise / Sunset
  sunriseEl.textContent = data.sunrise;
  sunsetEl.textContent = data.sunset;

  // Reveal the card with animation
  weatherCard.classList.add("visible");
}

/**
 * Updates only the temperature-related fields when unit is toggled.
 * @param {Object} data - Converted weather data from dataProcessor.convertUnits().
 */
export function updateUnitDisplay(data) {
  temperatureEl.textContent = data.temp != null ? data.temp : "—";
  unitLabelEl.textContent = data.unitLabel;
  feelsLikeEl.textContent =
    data.feelsLike != null ? `${data.feelsLike}${data.unitLabel}` : "—";
  windSpeedEl.textContent =
    data.windSpeed != null ? data.windSpeed : "—";
  windUnitEl.textContent = data.windUnit;
  dewPointEl.textContent =
    data.dewPoint != null ? `${data.dewPoint}${data.unitLabel}` : "—";
}

/**
 * Updates the unit toggle button's active state.
 * @param {string} activeUnit - "metric" or "us".
 */
export function updateToggleButton(activeUnit) {
  const celsiusBtn = document.getElementById("btn-celsius");
  const fahrenheitBtn = document.getElementById("btn-fahrenheit");

  if (activeUnit === "metric") {
    celsiusBtn.classList.add("active");
    fahrenheitBtn.classList.remove("active");
  } else {
    fahrenheitBtn.classList.add("active");
    celsiusBtn.classList.remove("active");
  }
}
