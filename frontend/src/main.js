import "./style.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const form = document.getElementById("searchForm");
const input = document.getElementById("cityInput");
const message = document.getElementById("message");
const result = document.getElementById("result");
const fx = document.getElementById("fx");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (city) getWeather(city);
});

async function getWeather(city) {
  message.textContent = "Loading...";
  try {
    const [wRes, fRes] = await Promise.all([
      fetch(`${API}/weather?city=${encodeURIComponent(city)}`),
      fetch(`${API}/forecast?city=${encodeURIComponent(city)}`),
    ]);
    const weather = await wRes.json();
    const forecast = await fRes.json();

    if (!wRes.ok) throw new Error(weather.error || "Something went wrong");

    showWeather(weather);
    showForecast(forecast);
    message.textContent = "";
  } catch (err) {
    result.classList.add("hidden");
    message.textContent = "⚠️ " + err.message;
  }
}

function showWeather(d) {
  document.getElementById("cityName").textContent = `${d.name}, ${d.sys.country}`;
  document.getElementById("icon").src =
    `https://openweathermap.org/img/wn/${d.weather[0].icon}@4x.png`;
  document.getElementById("temp").textContent = Math.round(d.main.temp) + "°C";
  document.getElementById("desc").textContent = d.weather[0].description;
  document.getElementById("humidity").textContent = d.main.humidity + "%";
  document.getElementById("wind").textContent = d.wind.speed + " m/s";
  document.getElementById("feels").textContent = Math.round(d.main.feels_like) + "°C";
  result.classList.remove("hidden");

  setTheme(d.weather[0].main, d.weather[0].icon);
}

function showForecast(f) {
  // pick one reading per day (around noon)
  const days = f.list.filter((x) => x.dt_txt.includes("12:00:00")).slice(0, 5);
  document.getElementById("forecast").innerHTML = days
    .map((x) => {
      const name = new Date(x.dt * 1000).toLocaleDateString("en-US", { weekday: "short" });
      return `<div class="day">
        ${name}
        <img src="https://openweathermap.org/img/wn/${x.weather[0].icon}.png" alt="" />
        <b>${Math.round(x.main.temp)}°</b>
      </div>`;
    })
    .join("");
}

function setTheme(main, icon) {
  const isNight = icon.endsWith("n");
  let theme = "default";

  if (main === "Clear") theme = isNight ? "clear-night" : "clear-day";
  else if (main === "Clouds") theme = "clouds";
  else if (main === "Rain" || main === "Drizzle") theme = "rain";
  else if (main === "Thunderstorm") theme = "storm";
  else if (main === "Snow") theme = "snow";
  else theme = "mist";

  document.body.className = "theme-" + theme;

  fx.innerHTML = "";
  if (theme === "rain" || theme === "storm") makeParticles("drop", 90);
  if (theme === "snow") makeParticles("flake", 60);
}

function makeParticles(type, count) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = type;
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDuration = (type === "drop" ? 0.6 + Math.random() * 0.6 : 4 + Math.random() * 5) + "s";
    p.style.animationDelay = Math.random() * 3 + "s";
    if (type === "flake") {
      const s = 4 + Math.random() * 6;
      p.style.width = p.style.height = s + "px";
    }
    fx.appendChild(p);
  }
}

// Load a default city on start
getWeather("Delhi");