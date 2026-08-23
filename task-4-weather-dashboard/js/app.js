"use strict";

// API Configuration
const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

// DOM Elements
const weatherForm = document.querySelector("#weather-form");
const cityInput = document.querySelector("#city-input");
const searchMessage = document.querySelector("#search-message");
const loadingState = document.querySelector("#loading-state");
const errorState = document.querySelector("#error-state");
const errorMessage = document.querySelector("#error-message");
const emptyState = document.querySelector("#empty-state");
const weatherCard = document.querySelector("#weather-card");

// Event Listeners
weatherForm.addEventListener("submit", handleWeatherSearch);

/**
 * Handle weather search form submission
 */
function handleWeatherSearch(event) {
  event.preventDefault();

  const cityName = cityInput.value.trim();

  if (!cityName) {
    showError("Please enter a city name");
    cityInput.setAttribute("aria-invalid", "true");
    return;
  }

  cityInput.setAttribute("aria-invalid", "false");
  clearMessage();
  searchWeather(cityName);
}

/**
 * Search for weather by city name
 */
async function searchWeather(cityName) {
  try {
    showLoading(true);
    hideAllStates();

    // Step 1: Get coordinates from city name
    const location = await geocodeCity(cityName);

    if (!location) {
      showError(`Could not find city "${cityName}". Please check the spelling and try again.`);
      showLoading(false);
      return;
    }

    // Step 2: Get weather data for coordinates
    const weatherData = await fetchWeatherData(location.latitude, location.longitude);

    if (!weatherData) {
      showError("Failed to fetch weather data. Please try again.");
      showLoading(false);
      return;
    }

    // Step 3: Display weather information
    displayWeather(location, weatherData);
    showLoading(false);
    showSuccess(`Weather updated for ${location.name}`);
  } catch (error) {
    console.error("Weather search error:", error);
    showError("An unexpected error occurred. Please try again.");
    showLoading(false);
  }
}

/**
 * Geocode city name to get coordinates
 */
async function geocodeCity(cityName) {
  try {
    const response = await fetch(
      `${GEOCODING_API}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
    );

    if (!response.ok) {
      console.error("Geocoding API error:", response.status);
      return null;
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    const result = data.results[0];

    return {
      name: result.name,
      country: result.country,
      latitude: result.latitude,
      longitude: result.longitude,
      timezone: result.timezone,
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

/**
 * Fetch weather data from Open-Meteo API
 */
async function fetchWeatherData(latitude, longitude) {
  try {
    const params = new URLSearchParams({
      latitude,
      longitude,
      current:
        "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,pressure_msl,wind_speed_10m,uv_index,visibility",
      timezone: "auto",
    });

    const response = await fetch(`${WEATHER_API}?${params}`);

    if (!response.ok) {
      console.error("Weather API error:", response.status);
      return null;
    }

    const data = await response.json();

    if (!data.current) {
      return null;
    }

    return data.current;
  } catch (error) {
    console.error("Weather fetch error:", error);
    return null;
  }
}

/**
 * Display weather information on the page
 */
function displayWeather(location, weatherData) {
  // Update location info
  document.querySelector("#location-name").textContent = `${location.name}, ${location.country}`;
  document.querySelector(
    "#location-coords"
  ).textContent = `${location.latitude.toFixed(2)}°N, ${Math.abs(location.longitude).toFixed(2)}°${location.longitude < 0 ? "W" : "E"}`;

  // Update time
  const now = new Date();
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: location.timezone,
  });
  document.querySelector("#weather-time").textContent = `Updated: ${timeFormatter.format(now)}`;

  // Get weather description and emoji
  const weatherInfo = getWeatherInfo(weatherData.weather_code);

  // Update weather display
  document.querySelector("#weather-emoji").textContent = weatherInfo.emoji;
  document.querySelector("#weather-description").textContent = weatherInfo.description;
  document.querySelector("#temperature").textContent = Math.round(weatherData.temperature_2m);

  const feelsLike = weatherData.apparent_temperature;
  const tempDiff = Math.round(weatherData.temperature_2m) - Math.round(feelsLike);
  let feelsLikeText = `Feels like ${Math.round(feelsLike)}°C`;
  if (tempDiff !== 0) {
    feelsLikeText += ` (${tempDiff > 0 ? "cooler" : "warmer"} than actual)`;
  }
  document.querySelector("#feels-like").textContent = feelsLikeText;

  // Update weather details
  document.querySelector("#humidity").textContent = `${weatherData.relative_humidity_2m}%`;
  document.querySelector("#wind-speed").textContent = `${Math.round(weatherData.wind_speed_10m)} km/h`;
  document.querySelector("#pressure").textContent = `${Math.round(weatherData.pressure_msl)} hPa`;
  document.querySelector("#uv-index").textContent = `${Math.round(weatherData.uv_index * 10) / 10}`;

  const visibilityKm = (weatherData.visibility / 1000).toFixed(1);
  document.querySelector("#visibility").textContent = `${visibilityKm} km`;
  document.querySelector("#cloud-cover").textContent = `${weatherData.cloud_cover}%`;

  // Show weather card
  weatherCard.hidden = false;
  emptyState.hidden = true;
}

/**
 * Convert WMO weather code to description and emoji
 */
function getWeatherInfo(code) {
  const weatherCodes = {
    0: { description: "Clear sky", emoji: "☀️" },
    1: { description: "Mainly clear", emoji: "🌤️" },
    2: { description: "Partly cloudy", emoji: "⛅" },
    3: { description: "Overcast", emoji: "☁️" },
    45: { description: "Foggy", emoji: "🌫️" },
    48: { description: "Foggy with frost", emoji: "🌫️" },
    51: { description: "Light drizzle", emoji: "🌧️" },
    53: { description: "Moderate drizzle", emoji: "🌧️" },
    55: { description: "Dense drizzle", emoji: "🌧️" },
    61: { description: "Slight rain", emoji: "🌧️" },
    63: { description: "Moderate rain", emoji: "🌧️" },
    65: { description: "Heavy rain", emoji: "⛈️" },
    71: { description: "Slight snow", emoji: "🌨️" },
    73: { description: "Moderate snow", emoji: "🌨️" },
    75: { description: "Heavy snow", emoji: "🌨️" },
    77: { description: "Snow grains", emoji: "🌨️" },
    80: { description: "Slight rain showers", emoji: "🌧️" },
    81: { description: "Moderate rain showers", emoji: "⛈️" },
    82: { description: "Violent rain showers", emoji: "⛈️" },
    85: { description: "Slight snow showers", emoji: "🌨️" },
    86: { description: "Heavy snow showers", emoji: "🌨️" },
    95: { description: "Thunderstorm", emoji: "⛈️" },
    96: { description: "Thunderstorm with hail", emoji: "⛈️" },
    99: { description: "Thunderstorm with hail", emoji: "⛈️" },
  };

  return weatherCodes[code] || { description: "Unknown", emoji: "❓" };
}

/**
 * UI State Management
 */
function showLoading(show) {
  loadingState.hidden = !show;
}

function showError(message) {
  errorMessage.textContent = message;
  errorState.hidden = false;
  searchMessage.textContent = "";
  searchMessage.className = "status-message";
}

function showSuccess(message) {
  searchMessage.textContent = message;
  searchMessage.className = "status-message success";
}

function clearMessage() {
  searchMessage.textContent = "";
  searchMessage.className = "status-message";
}

function hideAllStates() {
  errorState.hidden = true;
  loadingState.hidden = true;
  weatherCard.hidden = true;
  emptyState.hidden = true;
}

// Allow Enter key to submit even when focusing on the input
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && document.activeElement === cityInput) {
    weatherForm.dispatchEvent(new Event("submit"));
  }
});
