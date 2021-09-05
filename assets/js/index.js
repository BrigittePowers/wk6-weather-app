// https://openweathermap.org/api/one-call-api

var search = document.querySelector(".search-form");
var searchInput = document.querySelector(".search-form input");

//open weather API
var apiKey = "1cb7c69e383c2b520c672451a8fbde1a";

// User searches a city
search.addEventListener("submit", function(event){
    event.preventDefault();
    
    // user submits a city search request
    var city = searchInput.value;

    // fetch data from the api
    getCityForecast(city);

    // display data to user

    // if the city is not on the cities list, add it



});

// Hourly Forecast
function getCityForecast(city) {
    var requestURL = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}"
    fetch(requestURL + city + "&appid=" + apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
        })

}

// User presented with current and future conditions for that city

// City is added to search history - local storage

// User views current weather conditions for that city

// User presented with city name

// ... date

// ... icon representation of conditions

// ... the temperature

// ... the humidity

// ... wind speed

// ... UV index

// User views UV index

// Presented with color that indicates whether conditions are favorable/moderate/severe

// User views future weather data for that city

// Presented with current and future conditions for that city



var cityName = "";

var stateCode = "";

var countryCode ="";

// API call for hourly 4-day forecast
