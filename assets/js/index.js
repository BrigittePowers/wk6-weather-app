var search = document.querySelector(".search-form");
var cityInput = document.querySelector(".search-form input");
var display = document.querySelector(".search-list");
var cityList;
var cityHistory = document.querySelector(".history");

//open weather API
var apiKey = "95dda93988614202cb796a38de218adc";
var city;
var units = "&units=imperial";
var unitsIcon = "°F";

document.onload = history();

// user searches a city by submitting the form
search.addEventListener("submit", async function(event){
    event.preventDefault();

    //reset forecast display
    display.innerHTML = "";

    // record user's city
    city = titlecase(cityInput.value);

    //locally store search history
    var cityStorage = JSON.parse(localStorage.getItem("cities"));

    // if cityStorage exists already and city is not yet on list
    if (cityStorage !==null && cityStorage.indexOf(city) === -1) {
        //add city to list
        cityList = cityStorage.concat(city);
        // keep list at no more than 5 searches
        if (cityList.length > 5) {
            cityList = cityList.slice(1);
            
        }
    // otherwise start a new list using the city
    } else if (cityStorage == null) {
        cityList = [city];
    }

    history();

    localStorage.setItem("cities", JSON.stringify(cityList));

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

    //calculate time stamps
    var dayname = new Date(data.daily[0].dt * 1000).toLocaleDateString("en", {
        weekday: "long",
    });

    // 5 days out
    for (i = 0; i < 5; i++) {
        // create elements
        var weeklyData = document.createElement("ul");
        weeklyData.classList.add("data-weekly","forecast-box");

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

        iconDisWeek.innerHTML = "<img src= https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png></img>"; //weather icon
        descDisWeek.innerHTML = "<span id='description'>" + data.daily[i].weather[0].description + "</span>"; //desc
        tempDisWeek.innerHTML = "<span id='temp'>" + Math.trunc(data.daily[i].temp.max) + "<sup>" + unitsIcon + "</sup> - " + Math.trunc(data.daily[0].temp.min) + "<sup>" + unitsIcon + "</sup></span>"; //temperature
        dateDisWeek.innerHTML = "<span id='day'>" + day + "</span>"; //date 
        humidDisWeek.innerHTML = "Humidity: " + data.daily[i].humidity + "%";//humidity
        windDisWeek.innerHTML = "Wind: " + data.daily[i].wind_speed + " mph"//wind speed
        uvDisWeek.innerHTML = "UV Index: <span id=uvi>" + data.daily[i].uvi + "</span>" //UV index
        
        weeklyData.appendChild(iconDisWeek);
        weeklyData.appendChild(dateDisWeek);
        weeklyData.appendChild(descDisWeek);
        weeklyData.appendChild(tempDisWeek);
        weeklyData.appendChild(humidDisWeek);
        weeklyData.appendChild(windDisWeek);
        weeklyData.appendChild(uvDisWeek);

        // color UVI
         //Low 1-2
        if (data.daily[i].uvi < 3) {
            var indexLow = document.createElement("li");
            indexLow.classList.add("low");
            indexLow.innerHTML = "Low";
            weeklyData.appendChild(indexLow);
        //Moderate 3-5
        } else if (data.daily[i].uvi >= 3 && data.daily[i].uvi < 6) {
            var indexModerate = document.createElement("li");
            indexModerate.classList.add("moderate");
            indexModerate.innerHTML = "Moderate";
            weeklyData.appendChild(indexModerate);
        //High 6-7
        } else if (data.daily[i].uvi >= 6 && data.daily[i].uvi < 8) {
            var indexHigh = document.createElement("li");
            indexHigh.classList.add("high");
            indexHigh.innerHTML = "High";
            weeklyData.appendChild(indexHigh);
        // V High 8-10
        } else if (data.daily[i].uvi >= 8 && data.daily[i].uvi < 11) {
            var indexVHigh = document.createElement("li");
            indexVHigh.classList.add("very-high");
            indexVHigh.innerHTML = "Very High";
            weeklyData.appendChild(indexVHigh);
        //Extreme
        } else if (data.daily[i].uvi >= 11) {
            var indexExtreme = document.createElement("li");
            indexExtreme.classList.add("extreme");
            indexExtreme.innerHTML = "Extreme";
            weeklyData.appendChild(indexExtreme);
        } 
        //High 6-7
        //V High 8-10
        //Extreme 11+

        display.appendChild(weeklyData);
    }

}

// retrieve lat/lon
async function getCityLocation(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

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

//history
function history() {
    cityHistory.innerHTML = "";

    if (cityList !== undefined) {
        for (i=0; i < cityList.length; i++) {
            var cityButton = document.createElement("button");
            cityButton.setAttribute("value", cityList[i]);
            cityButton.innerHTML = cityList[i];
            cityHistory.appendChild(cityButton);
            
            //closure fix
            var c = cityButton
            if (typeof cityButton.addEventListener === 'function'){
                (function (c) {
                    c.addEventListener("click", function() {
                        cityInput.value = c.value;
                    });
                })(c);
            }
        }
        
    }
    
}

// titlecase user entry
function titlecase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}