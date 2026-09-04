import React, { useState } from "react";
import Axios from "https://cdn.skypack.dev/axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const API_KEY = "56a2c31c64a6247e0e851f88799c0dd5";

const WeatherInfoIcons = {
  sunset: "https://img.icons8.com/fluency/48/000000/sunset.png",
  sunrise: "https://img.icons8.com/fluency/48/000000/sunrise.png",
  humidity: "https://img.icons8.com/fluency/48/000000/hygrometer.png",
  wind: "https://img.icons8.com/fluency/48/000000/wind.png",
  pressure: "https://img.icons8.com/fluency/48/000000/atmospheric-pressure.png",
};

const WeatherIcons = {
  "01d": "https://img.icons8.com/fluency/96/000000/sun.png",
  "01n": "https://img.icons8.com/fluency/96/000000/full-moon.png",
  "02d": "https://img.icons8.com/fluency/96/000000/partly-cloudy-day.png",
  "02n": "https://img.icons8.com/fluency/96/000000/partly-cloudy-night.png",
  "03d": "https://img.icons8.com/fluency/96/000000/moderate-rain.png",
  "03n": "https://img.icons8.com/fluency/96/000000/moderate-rain.png",
  "04d": "https://img.icons8.com/fluency/96/000000/clouds.png",
  "04n": "https://img.icons8.com/fluency/96/000000/partly-cloudy-night.png",
  "09d": "https://img.icons8.com/fluency/96/000000/partly-cloudy-rain.png",
  "09n": "https://img.icons8.com/fluency/96/000000/rainy-night.png",
  "10d": "https://img.icons8.com/fluency/96/000000/partly-cloudy-rain.png",
  "10n": "https://img.icons8.com/fluency/96/000000/rainy-night.png",
  "11d": "https://img.icons8.com/fluency/96/000000/chance-of-storm.png",
  "11n": "https://img.icons8.com/fluency/96/000000/stormy-night.png",
};

const CityComponent = ({ updateCity, fetchWeather }) => (
  <div className="cityComponent">
    <img
      src="https://media.tenor.com/jVTtVbIu9v0AAAAi/smile-sun.gif"
      className="weatherLogo"
    />
    <span className="chooseCityLabel">Find the weather of your city</span>
    <form className="searchBox" onSubmit={fetchWeather}>
      <input
        placeholder="City"
        onChange={(event) => updateCity(event.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  </div>
);

const WeatherInfoComponent = ({ name, value }) => (
  <div className="infoContainer">
    <div className="infoIcon">
      <img src={WeatherInfoIcons[name]} alt={name} />
    </div>
    <span className="infoLabel">
      {value}
      <span>{name}</span>
    </span>
  </div>
);

const WeatherComponent = ({ weather }) => {
  const isDay = weather?.weather[0].icon?.includes("d");
  const getTime = (timeStamp) =>
    `${new Date(timeStamp * 1000).getHours()} : ${new Date(
      timeStamp * 1000
    ).getMinutes()}`;

  return (
    <div className="weatherComponent">
      <div className="weatherCondition">
        <span className="condition">
          <span>{`${Math.floor(weather?.main?.temp - 273)}°C`}</span>
          {` | ${weather?.weather[0].description}`}
        </span>
        <img src={WeatherIcons[weather?.weather[0].icon]} alt="weather-icon" />
      </div>
      <span className="location">{`${weather?.name}, ${weather?.sys?.country}`}</span>
      <span className="weatherInfoLabel">Weather info</span>
      <div className="weatherInfoContainer">
        <WeatherInfoComponent
          name={isDay ? "sunset" : "sunrise"}
          value={getTime(weather?.sys[isDay ? "sunset" : "sunrise"])}
        />
        <WeatherInfoComponent name="humidity" value={weather?.main?.humidity} />
        <WeatherInfoComponent name="wind" value={weather?.wind?.speed} />
        <WeatherInfoComponent name="pressure" value={weather?.main?.pressure} />
      </div>
    </div>
  );
};

function App() {
  const [city, updateCity] = useState("");
  const [weather, updateWeather] = useState(null);
  const reset = () => {
    updateCity("");
    updateWeather(null);
  };
  const MySwal = withReactContent(Swal);
  const fetchWeather = async (event) => {
    try {
      event.preventDefault();
      const response = await Axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );
      updateWeather(response.data);
    } catch (error) {
      console.log(error);
      MySwal.fire({
        icon: "error",
        title: "Can't find it",
        text: "Please try a valid city (like London, New York, Taipei, etc.)",
        footer: '<a href="https://www.cat-gpt.com/chat/meow">Click here 🧝🏻‍♀️</a>',
        width: 600,
        padding: "1em",
        color: "#716add",
        background: "#fff url(https://sweetalert2.github.io/images/trees.png)",
        backdrop: `
          rgba(0,0,123,0.4)
          url("https://sweetalert2.github.io/images/nyan-cat.gif")
          left top
          no-repeat
        `,
      });
    }
  };

  return (
    <div className="container">
      <span className="appLabel">Monica Weather App</span>
      {city && weather ? (
        <>
          <WeatherComponent weather={weather} />
          <button className="searchButton" onClick={reset}>
            Search Again
          </button>
        </>
      ) : (
        <CityComponent updateCity={updateCity} fetchWeather={fetchWeather} />
      )}
    </div>
  );
}

export default App;
