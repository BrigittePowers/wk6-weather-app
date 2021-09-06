var search = document.querySelector(".search-form");
var cityInput = document.querySelector(".search-form input");
var display = document.querySelector(".search-list");

//open weather API
var apiKey = "95dda93988614202cb796a38de218adc";
var city;
var units = "&units=imperial";
var unitsIcon = "°F"

// user searches a city by submitting the form
search.addEventListener("submit", async function(event){
    event.preventDefault();

    display.innerHTML = "";

    // record user's city
    city = cityInput.value;

    // wait while fetch request returns latitude and longitude
    var cityLoc = await getCityLocation(city);
    var cityLat = cityLoc[0];
    var cityLon = cityLoc[1];

    // feed location data into open weather one call API
    var cityForecast = await getCityWeather(cityLat, cityLon);

    // display data to user
    forecastDisplay(cityForecast);

    // if the city is not on the cities list, add it

});

function forecastDisplay (data) {
    //make elements
    var bubbleData = document.createElement("ul");
    bubbleData.classList.add("data-bubble");
    var dailyData = document.createElement("ul");
    dailyData.classList.add("data-daily");
    var weeklyData = document.createElement("ul");
    weeklyData.classList.add("data-weekly");

    //calculate time stamps
    var dayname = new Date(data.daily[0].dt * 1000).toLocaleDateString("en", {
        weekday: "long",
    });

    //bubbleData list items
    var iconDis = document.createElement("li");
    var cityDis = document.createElement("li");
    var descDis = document.createElement("li");
    var tempDis = document.createElement("li");

    //bubble data innerHTML
    iconDis.innerHTML = "<img src= http://openweathermap.org/img/wn/" + data.daily[0].weather[0].icon + "@2x.png></img>"; //weather icon
    cityDis.innerHTML = city; // city name
    descDis.innerHTML = data.daily[0].weather[0].description; //desc
    tempDis.innerHTML = Math.trunc(data.daily[0].temp.max) + "<sup>" + unitsIcon + "</sup> - " + Math.trunc(data.daily[0].temp.min) + "<sup>" + unitsIcon + "</sup>"; //temperature

    //bubble data append
    display.appendChild(bubbleData);
    bubbleData.appendChild(iconDis);
    bubbleData.appendChild(cityDis);
    bubbleData.appendChild(descDis);
    bubbleData.appendChild(tempDis);

    // daily list items
    var dateDis = document.createElement("li");
    var humidDis = document.createElement("li");
    var windDis = document.createElement("li");
    var uvDis = document.createElement("li");

    // daily data innerHTML
        dateDis.innerHTML = dayname; //date
        humidDis.innerHTML = "Humidity: " + data.daily[0].humidity + "%";//humidity
        windDis.innerHTML = "Wind: " + data.daily[0].wind_speed + " mph"//wind speed
        uvDis.innerHTML = "UV Index: " + data.daily[0].uvi + " - " //UV index //TODO: color uvi by severity

    // daily data append
    display.appendChild(dailyData);
    dailyData.appendChild(dateDis);
    dailyData.appendChild(humidDis);
    dailyData.appendChild(windDis);
    dailyData.appendChild(uvDis);

    // 4 days out
    for (i = 1; i < 5; i++) {
        // create elements

        var day = new Date(data.daily[i].dt * 1000).toLocaleDateString("en", {
            weekday: "long",
        });

        var iconDisWeek = document.createElement("li");
        var descDisWeek = document.createElement("li");
        var tempDisWeek = document.createElement("li");
        var dateDisWeek = document.createElement("li");
        var humidDisWeek = document.createElement("li");
        var windDisWeek = document.createElement("li");
        var uvDisWeek = document.createElement("li");

        iconDisWeek.innerHTML = "<img src= http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png></img>"; //weather icon
        descDisWeek.innerHTML = data.daily[i].weather[0].description; //desc
        tempDisWeek.innerHTML = Math.trunc(data.daily[i].temp.max) + "<sup>" + unitsIcon + "</sup> - " + Math.trunc(data.daily[0].temp.min) + "<sup>" + unitsIcon + "</sup>"; //temperature
        dateDisWeek.innerHTML = day; //date
        humidDisWeek.innerHTML = "Humidity: " + data.daily[i].humidity + "%";//humidity
        windDisWeek.innerHTML = "Wind: " + data.daily[i].wind_speed + " mph"//wind speed
        uvDisWeek.innerHTML = "UV Index: " + data.daily[i].uvi + " - " //UV index //TODO: color uvi by severity

        weeklyData.appendChild(iconDisWeek);
        weeklyData.appendChild(dateDisWeek);
        weeklyData.appendChild(descDisWeek);
        weeklyData.appendChild(tempDisWeek);
        weeklyData.appendChild(humidDisWeek);
        weeklyData.appendChild(windDisWeek);
        weeklyData.appendChild(uvDisWeek);

        display.appendChild(weeklyData);
    }

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

// City is added to search history - local storage

// User views current weather conditions for that city

// User views future weather data for that city

// Presented with current and future conditions for that city

// API call for hourly 4-day forecast
