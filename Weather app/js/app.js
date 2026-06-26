/**
 * app.js — Application Entry Point
 * Wires all modules together. Manages app state and event listeners.
 * No direct DOM manipulation (delegated to ui.js) and no raw API calls (delegated to api.js).
 */

import { fetchWeather, WeatherAPIError } from "./api.js";
import { processWeatherData, convertUnits } from "./dataProcessor.js";
import {
  showLoading,
  hideLoading,
  showError,
  hideError,
  renderWeather,
  updateUnitDisplay,
  updateToggleButton,
} from "./ui.js";

// ─── App State ────────────────────────────────────────────────────────────────

const state = {
  currentData: null,   // Last successfully processed weather object
  currentUnit: "metric", // "metric" | "us"
  isLoading: false,
};

// ─── Core Search Logic ────────────────────────────────────────────────────────

/**
 * Performs a full weather search for a given location string.
 * Fetches fresh data from API, processes it, and renders it.
 * @param {string} location - User-supplied location string.
 */
async function searchWeather(location) {
  if (state.isLoading) return;
  state.isLoading = true;

  showLoading();

  try {
    const raw = await fetchWeather(location, state.currentUnit);
    const processed = processWeatherData(raw, state.currentUnit);

    state.currentData = processed;

    renderWeather(processed);
    updateToggleButton(state.currentUnit);
    hideError();
  } catch (err) {
    if (err instanceof WeatherAPIError) {
      showError(err.message);
    } else {
      showError("An unexpected error occurred. Please try again.");
      console.error("Unexpected error:", err);
    }
  } finally {
    state.isLoading = false;
    hideLoading();
  }
}

// ─── Unit Toggle Logic ────────────────────────────────────────────────────────

/**
 * Switches the displayed unit between Celsius and Fahrenheit.
 * Uses cached data — no new API call required.
 * @param {string} targetUnit - "metric" or "us".
 */
function toggleUnit(targetUnit) {
  if (targetUnit === state.currentUnit) return;
  if (!state.currentData) return;

  state.currentUnit = targetUnit;

  // Convert the cached data in-memory
  const converted = convertUnits(state.currentData, targetUnit);
  state.currentData = converted;

  updateUnitDisplay(converted);
  updateToggleButton(targetUnit);
}

// ─── Event Listeners ──────────────────────────────────────────────────────────

// Search form submission
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const location = searchInput.value.trim();
  if (location) {
    searchWeather(location);
  }
});

// Error toast close button
document.getElementById("error-close").addEventListener("click", () => {
  hideError();
});

// Unit toggle buttons
document.getElementById("btn-celsius").addEventListener("click", () => {
  toggleUnit("metric");
});

document.getElementById("btn-fahrenheit").addEventListener("click", () => {
  toggleUnit("us");
});

// ─── Initial Load ─────────────────────────────────────────────────────────────

// Load a default city on startup for a great first impression
searchWeather("London");
