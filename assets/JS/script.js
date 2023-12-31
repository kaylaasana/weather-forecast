// element selectors
var searchBtn = document.getElementById("search-button");
// display recent searches
function displayRecent() {
  var recentSearches = JSON.parse(
    localStorage.getItem("recentSearches") || "[]"
  );
  var recentSearchEl = document.getElementById("recent-searches");

  recentSearchEl.innerHTML = "";

  recentSearches.forEach(function (searchItem) {
    var listEl = document.createElement("button");
    listEl.setAttribute("class", "col-4 w-100");
    listEl.textContent = searchItem;
    recentSearchEl.appendChild(listEl);

    listEl.addEventListener("click", function () {
      var cityName = listEl.textContent;
      searchCurrent(cityName);
    });
  });
}
// function that makes calls to API for the city data
function searchCurrent(
  searchInput = document.getElementById("search-input").value
) {
  var geoCode =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    searchInput +
    "&appid=6f32794f43e74f5523608b6bb0478735";

  fetch(geoCode)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var recentSearches =
        JSON.parse(localStorage.getItem("recentSearches")) || [];
      recentSearches.push(searchInput);
      localStorage.setItem("recentSearches", JSON.stringify(recentSearches));

      displayRecent();

      var lat = data[0].lat;
      var lon = data[0].lon;
      getWeather(lat, lon);
      getForecast(lat, lon);
    });
}
// function to call for the current weather using city data
function getWeather(lat, lon) {
  var currentWeather =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=6f32794f43e74f5523608b6bb0478735&units=imperial";
  return fetch(currentWeather)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      document.querySelector(".current-weather").innerHTML = "";
      var weatherCard = document.createElement("div");
      weatherCard.setAttribute("class", "card justify-content-start w-100");
      weatherCard.setAttribute("style", "width: 18rem");
      var searchName = document.createElement("h3");
      searchName.textContent = data.name;
      var temp = document.createElement("h4");
      temp.textContent = "Temperature: " + Math.floor(data.main.temp) + " F";
      var icon = document.createElement("img");
      icon.setAttribute(
        "src",
        `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
      );
      icon.setAttribute("class", "current-icon");
      var wind = document.createElement("p");
      wind.textContent = "Wind Speed: " + data.wind.speed + " mph";
      var humidity = document.createElement("p");
      humidity.textContent = "Humidity: " + data.main.humidity + " %";
      var currentDate = dayjs().format("MMM-D");
      weatherCard.append(currentDate, searchName, temp, icon, wind, humidity);
      document.querySelector(".current-weather").append(weatherCard);
    });
}
// function to call for 5 day forecast using city data
function getForecast(lat, lon) {
  var currentWeather =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=6f32794f43e74f5523608b6bb0478735&units=imperial";
  return fetch(currentWeather)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      document.querySelector("#weather-forecast").innerHTML = "";
      for (var i = 4; i < data.list.length; i += 8) {
        console.log(data.list[i]);
        var forecastCard = document.createElement("div");
        forecastCard.setAttribute("class", "card col");
        forecastCard.setAttribute("style", "width: 18rem");
        var temp = document.createElement("h5");
        temp.textContent =
          "Temperature: " + Math.floor(data.list[i].main.temp) + " F";
        var icon = document.createElement("img");
        icon.setAttribute(
          "src",
          `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`
        );
        icon.setAttribute("class", "current-icon");
        var forecastDate = dayjs(data.list[i].dt_txt).format("MMM-D");
        var forecastWind = document.createElement("p");
        forecastWind.textContent =
          "Wind Speed: " + data.list[i].wind.speed + " mph";
        var forecastHum = document.createElement("p");
        forecastHum.textContent =
          "Humidity: " + data.list[i].main.humidity + " %";
        forecastCard.append(
          forecastDate,
          temp,
          icon,
          forecastWind,
          forecastHum
        );
        document.getElementById("weather-forecast").append(forecastCard);
      }
    });
}

displayRecent();
// event listener for search button
searchBtn.addEventListener("click", function () {
  searchCurrent();
});
