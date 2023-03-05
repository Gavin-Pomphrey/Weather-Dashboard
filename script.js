//construct the constants and variables needed for the project
const apiKey = '3fde91f0181f19d906e9f29eb8d5f1fa';
const weatherURL = 'https://api.openweathermap.org/data/2.5/weather';
const forecastURL = 'https://api.openweathermap.org/data/2.5/forecast';
const form = document.querySelector('form');
const cityInput = document.getElementById('city');
const currentWeatherDiv = document.getElementById('currentWeather');
const forecastDiv = document.getElementById('forecast');
const searchHistoryDiv = document.getElementById('searchHistory');
let searchHistory = [];

//function to retrieve weather data from for a city
function getWeatherData(city) {
    //construct the url to retrieve the data
    let url = weatherURL + city + '&appid=' + apiKey;
    //retrieve the data
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //display the data
            const cityName = data.name;
            const currentDate = new Date().toLocaleDateString();
            const temperature = data.main.temp;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const currentWeather = `
            <h2>${cityName} (${currentDate}) <img src="${weatherIcon}" alt="${data.weather[0].description}"></h2>
            <p>Temperature: ${temperature} °F</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} mph</p>
          `;
            currentWeatherDiv.innerHTML = currentWeather;
        })
        .catch(function (error) {
            console.log(error);
        });
}

//function to retrieve forecast data for a city
function getForecastData(city) {
    //construct the url to retrieve the data
    let url = forecastURL + city + '&appid=' + apiKey;
    //retrieve the data
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //display the data
            const forecast = data.list.filter(reading => reading.dt_txt.includes('12:00:00'));
            let forecastHTML = '';
            forecast.forEach(reading => {
                const date = new Date(reading.dt_txt).toLocaleDateString();
                const temperature = reading.main.temp;
                const humidity = reading.main.humidity;
                const weatherIcon = `http://openweathermap.org/img/w/${reading.weather[0].icon}.png`;
                forecastHTML += `
          <div class="col">
            <div class="card">
              <div class="card-body">
                <h4 class="card-title">${date}</h4>
                <img src="${weatherIcon}" alt="${reading.weather[0].description}">
                <p class="card-text">Temp: ${temperature} °F</p>
                <p class="card-text">Humidity: ${humidity}%</p>
              </div>
            </div>
          </div>
        `;
            });
            forecastDiv.innerHTML = forecastHTML;
        })
        .catch(function (error) {
            console.log(error);
        });
}

//function to handle the form submission
function formSubmitted(event) {
    event.preventDefault();
    const city = cityInput.value;
    getWeatherData(city);
    getForecastData(city);
    cityInput.value = '';
}


//function to add the city to the search history
function addToSearchHistory(city) {
    //check if the city is already in the search history
    if (!searchHistory.includes(city)) {
        //add the city to the search history
        searchHistory.push(city);
        //save the search history to local storage
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        //display the search history
        displaySearchHistory();
    }
}

//function to display the search history
function displaySearchHistory() {
    //get the search history from local storage
    searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    //display the search history
    let searchHistoryHTML = '';
    searchHistory.forEach(city => {
        searchHistoryHTML += `
      <li class="list-group-item">${city}</li>
    `;
    });
    searchHistoryDiv.innerHTML = searchHistoryHTML;
}

//function to handle the click on a city in the search history
function searchHistoryClicked(event) {
    const city = event.target.textContent;
    getWeatherData(city);
    getForecastData(city);
}

//add event listeners
form.addEventListener('submit', formSubmitted);
searchHistoryDiv.addEventListener('click', searchHistoryClicked);
