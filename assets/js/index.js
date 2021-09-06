var search = document.querySelector(".search-form");
var cityInput = document.querySelector(".search-form input");

//open weather API
var apiKey = "95dda93988614202cb796a38de218adc";
var city;
var units = "&units=imperial";
var unitsIcon = "°F"

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
    var cityForecast = await getCityWeather(cityLat, cityLon);

    // display data to user
    dataDisplay(cityForecast);

    // if the city is not on the cities list, add it

});

function dataDisplay (data) {
    //make elements
    var forecastDisplay = document.querySelector(".search-list");
    var bubbleData = document.createElement("ul");
    bubbleData.classList.add("data-bubble");
    var dailyData = document.createElement("ul");
    dailyData.classList.add("data-daily");

    //bubbleData list items
    var iconDis = document.createElement("li");
    var cityDis = document.createElement("li");
    var descDis = document.createElement("li");
    var tempDis = document.createElement("li");

    //bubble data innerHTML
    iconDis.innerHTML = "<img src= http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png></img>"; //weather icon
    cityDis.innerHTML = city; // city name
    descDis.innerHTML = data.current.weather[0].description; //desc
    tempDis.innerHTML = Math.trunc(data.current.temp) + "<sup>" + unitsIcon + "</sup>"; //temperature

    //bubble data append
    forecastDisplay.appendChild(bubbleData);
    bubbleData.appendChild(iconDis);
    bubbleData.appendChild(cityDis);
    bubbleData.appendChild(descDis);
    bubbleData.appendChild(tempDis);

    // daily list items

    // daily data innerHTML
        //date
        //humidity
        //wind speed
        //UV index - color by severity

    // daily data append
    forecastDisplay.appendChild(dailyData);


}

// retrieve lat/lon
async function getCityLocation(city) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

    var response = await fetch(queryURL);
    var data = await response.json();  

    var cityLoc = [data.coord.lat, data.coord.lon];
    return cityLoc
}

// one call API data
function getCityWeather(lat, lon) {
    var oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely&appid=" + apiKey + units;

    return fetch(oneCallURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            return data;
        })
}

// User presented with current and future conditions for that city

// City is added to search history - local storage

// User views current weather conditions for that city

// User views future weather data for that city

// Presented with current and future conditions for that city

// API call for hourly 4-day forecast
