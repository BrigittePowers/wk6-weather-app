// https://openweathermap.org/api/one-call-api

var search = document.querySelector(".search-form");
var cityInput = document.querySelector(".search-form input");

//open weather API
var apiKey = "95dda93988614202cb796a38de218adc";
var city;

// user searches a city by submitting the form
search.addEventListener("submit", async function(event){
    event.preventDefault();

    // record user's city
    city = cityInput.value;

    // wait while fetch request returns latitude and longitude
    var cityLoc = await getCityLocation(city);
    var cityLat = cityLoc[0];
    var cityLon = cityLoc[1];

    // feed location data into open weather one call API
    var cityForecast = getCityWeather(cityLon, cityLat)

    // display data to user
    

    // if the city is not on the cities list, add it

});

// retrieve lat/lon
async function getCityLocation(city) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

    var response = await fetch(queryURL);
    var data = await response.json();  

    var cityLoc = [data.coord.lat, data.coord.lon];
    return cityLoc
}

// one call API
function getCityWeather(lon, lat) {
    var oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely&appid=" + apiKey;

    fetch(oneCallURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
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


// API call for hourly 4-day forecast
