const today__div = document.getElementById("today");
const future__div = document.getElementById("futureCards");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const history__ul = document.getElementById("history");
const API_KEY = "8bb2ead1ec01028b41139e6bb84639aa";

history__ul.addEventListener("click", (event) => {
  searchInput.value = event.target.innerText;
  main(searchInput.value);
});

const getLatAndLong = async (cityName) => {
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${API_KEY}`
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
