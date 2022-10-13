const today__div = document.getElementById("today");
const future__div = document.getElementById("futureCards");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const history__ul = document.getElementById("history");
const API_KEY = "692efab00ae66e9f48137e6ea4766fcd";

history__ul.addEventListener("click", (event) => {
  searchInput.value = event.target.innerText;
  main(searchInput.value);
});

const getLatAndLong = async (cityName) => {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${API_KEY}`
  );
  const data = await response.json();
  if (!data) {
    return {};
  } else if (data.length < 1) {
    return {};
  }
  return {
    lat: data[0].lat,
    lon: data[0].lon,
  };
};

const getWeather = async (lat, lon) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
  );
  const data = await response.json();
  return data;
};

const parseData = (rawData) => {
  let parsedData = {};
  parsedData.date = new Date(rawData.dt_txt).toLocaleString().split(",")[0];
  parsedData.cityName = searchInput.value;
  parsedData.temp = rawData.main.temp;
  parsedData.humidity = rawData.main.humidity;
  parsedData.wind = rawData.wind.speed;
  parsedData.icon = `https://openweathermap.org/img/w/${rawData.weather[0].icon}.png`;
  return parsedData;
};

const createCurrentWeatherCard = (data) => {
  let div = document.createElement("div");
  let name = document.createElement("h3");
  name.innerText = data.cityName + " " + data.date;
  let icon = document.createElement("img");
  icon.src = data.icon;
  let temp = document.createElement("p");
  temp.innerHTML = `Temp: ${data.temp}&deg;F`;
  let humidity = document.createElement("p");
  humidity.innerText = `Humidity: ${data.humidity}%`;
  let wind = document.createElement("p");
  wind.innerText = `Wind: ${data.wind} MPH`;
  div.append(name, icon, temp, humidity, wind);
  return div;
};

const createFutureCard = (data) => {
  let div = document.createElement("div");
  div.classList.add("future-card");
  let date = document.createElement("p");
  date.classList.add("card-date");
  date.innerText = data.date;
  let icon = document.createElement("img");
  icon.src = data.icon;
  let temp = document.createElement("p");
  temp.innerHTML = `Temp: ${data.temp}&deg;F`;
  let humidity = document.createElement("p");
  humidity.innerText = `Humidity: ${data.humidity}%`;
  let wind = document.createElement("p");
  wind.innerHTML = `Wind: ${data.wind}MPH`;
  div.append(date, icon, temp, humidity, wind);
  return div;
};

const addToLS = (value) => {
  let dataFromLS = localStorage.getItem("history");
  if (!dataFromLS) {
    dataFromLS = "[]";
  }
  dataFromLS = JSON.parse(dataFromLS);
  dataFromLS.push(value);
  localStorage.setItem("history", JSON.stringify(dataFromLS));
};

const getHistory = (value) => {
  let dataFromLS = localStorage.getItem("history");
  if (!dataFromLS) {
    dataFromLS = "[]";
  }
  return [...new Set(JSON.parse(dataFromLS))];
};

const createHistoryElem = (value) => {
  let history__li = document.createElement("li");
  history__li.innerText = value;
  history__ul.prepend(history__li);
};

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  let value = searchInput.value.trim();
  if (!value) {
    alert("City Name Cannot Be Empty");
    return;
  }
  // Add history to local storage
  addToLS(value);
  // Add search query to history ul
  createHistoryElem(value);
  await main(value);
});

const main = async (cityName) => {
  // Find lat and long using location
  let { lat, lon } = await getLatAndLong(cityName);
  if (!lat || !lon) {
    alert("Invalid City Name");
    return;
  }
  // call the api with lat and long
  let weatherInfo = await getWeather(lat, lon);
  let parsedData = [];
  if (weatherInfo && weatherInfo.cod == "200") {
    let weatherList = weatherInfo.list;
    // parse the result
    for (let i = 0; i < weatherList.length; i += 8) {
      let parsed = parseData(weatherList[i]);
      parsedData.push(parsed);
    }
    parsedData.push(parseData(weatherList[weatherList.length - 1]));
  } else {
    alert("Error while getting weather info");
    return;
  }
  // display the parsed result
  today__div.innerHTML = "";
  today__div.append(createCurrentWeatherCard(parsedData[0]));

  future__div.innerHTML = "";
  for (let i = 1; i < parsedData.length; i++) {
    future__div.append(createFutureCard(parsedData[i]));
  }
};

window.addEventListener("DOMContentLoaded", () => {
  let history = getHistory();
  history.forEach((city) => {
    createHistoryElem(city);
  });
  searchInput.value = "Atlanta";
  main("Atlanta");
});
