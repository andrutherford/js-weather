//Define relevant variables
var apiKey = config.API_KEY;
let skycons = new Skycons({"color": "white"});
let currentLocation;
let time;
let temperature;
let icon;
let summary;
let weatherInfo;
let apparentTemperature;
let windDirection;
let windSpeed;
let humidity;
let pressure;
let visibility;
let btn;
let unit = 'f';
let unit2 = 'miles';
let windUnit;
let visUnit;
let converters;
let convertTemperatureBtn;
let convertDistanceBtn;
let refresh;

window.onload = function() {
    //Assign variables to elements on window load
    currentLocation         =   document.getElementById("location");
    time                    =   document.getElementById("time");
    temperature             =   document.getElementById("temperature");
    icon                    =   document.getElementById("icon");
    summary                 =   document.getElementById("summary");
    weatherInfo             =   document.getElementById("weather-info");
    apparentTemperature     =   document.getElementById("apparent-temperature");
    windDirection           =   document.getElementById("wind-direction");
    windSpeed               =   document.getElementById("wind-speed");
    humidity                =   document.getElementById("humidity");
    pressure                =   document.getElementById("pressure");
    visibility              =   document.getElementById("visibility")
    btn                     =   document.getElementById("getWeather");
    converters              =   document.getElementById("converters");
    convertTemperatureBtn   =   document.getElementById("convert-temperature");
    convertDistanceBtn      =   document.getElementById("convert-distance");
    windUnit                =   document.getElementById("wind-unit");
    visUnit                 =   document.getElementById("vis-unit");
    refresh                 =   document.getElementById("refresh");
}

function convertTemp(temp, unit) {
  if (unit == 'f') {
    //Convert fahrenheit to celsius
    return Math.round((temp - 32) * 5 / 9);
  }
  else if (unit == 'c') {
    //Convert celsius to fahrenheit
    return Math.round(temp * 9 / 5 + 32);
  }
}

function convertDistance(distance, unit) {
  if(unit == 'miles') {
    return Math.round(distance / 0.62137);
  }
  else if (unit == 'km') {
    return Math.round(distance * 0.62137);
  }
}

function getTime() {
  let date = new Date();
  let hour = date.getHours();
  let min = date.getMinutes();
  return hour + ':' + min;
}

const getWeather = function() {
  //Get user location
  if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
          let latitude = position.coords.latitude;
          let longitude = position.coords.longitude;
          showWeather(latitude, longitude);
        });
  }
  else {
      window.alert("Could not retrieve location");
  }
}

function showWeather(latitude, longitude) {
    let url = `https://api.darksky.net/forecast/` + apiKey + `/${latitude},${longitude}` + `?format=jsonp&callback=displayWeather`;
    let script = document.createElement('script');
    script.type = "text/javascript";
    script.src = url;
    document.querySelector('body').appendChild(script);
    displayWeather(object);
}

let object;

function setIcon(weatherIcon) {
  //Possible icons: clear-day, clear-night, rain, snow, sleet,
  //  wind, fog, cloudy, partly-cloudy-day, partly-cloudy-night
  //  hail, thunderstorm, tornado (future)

  switch (weatherIcon) {
    case "clear-day":             skycons.add(document.getElementById("icon"), Skycons.CLEAR_DAY);            break;
    case "clear-night":           skycons.add(document.getElementById("icon"), Skycons.CLEAR_NIGHT);          break;
    case "rain":                  skycons.add(document.getElementById("icon"), Skycons.RAIN);                 break;
    case "snow":                  skycons.add(document.getElementById("icon"), Skycons.SNOW);                 break;
    case "sleet":                 skycons.add(document.getElementById("icon"), Skycons.SLEET);                break;
    case "wind":                  skycons.add(document.getElementById("icon"), Skycons.WIND);                 break;
    case "fog":                   skycons.add(document.getElementById("icon"), Skycons.FOG);                  break;
    case "cloudy":                skycons.add(document.getElementById("icon"), Skycons.CLOUDY);               break;
    case "partly-cloudy-day":     skycons.add(document.getElementById("icon"), Skycons.PARTLY_CLOUDY_DAY);    break;
    case "partly-cloudy-night":   skycons.add(document.getElementById("icon"), Skycons.PARTLY_CLOUDY_NIGHT);  break;
    case "hail":
    case "thunderstorm":
    case "tornado":
    default:                      console.log("Unrecognized weather type");                                   break;
  }
  icon.classList.add('animated','zoomIn');
  skycons.play();
}

function displayWeather(object) {

  btn.classList.add('animated','fadeOut');
  currentLocation.innerText = object.timezone;
  time.innerText = getTime();
  temperature.innerText = Math.round(object.currently.temperature);
  summary.innerText = object.currently.summary;
  apparentTemperature.innerText = Math.round(object.currently.apparentTemperature);
  humidity.innerText = object.currently.humidity;
  pressure.innerText = object.currently.pressure;
  windDirection.innerText = object.currently.windBearing;
  windSpeed.innerText = Math.round(object.currently.windSpeed);
  windUnit.innerText = ' mph';
  visibility.innerText = Math.round(object.currently.visibility);
  visUnit.innerText = ' miles';
  setIcon(object.currently.icon);
  btn.parentElement.removeChild(btn);

  convertTemperatureBtn.addEventListener('click', function() {
    if (unit == 'f') {
      temperature.innerText = convertTemp(temperature.innerText, 'f');
      apparentTemperature.innerText = convertTemp(apparentTemperature.innerText, 'f');
      unit = 'c';
    }
    else {
      temperature.innerText = convertTemp(temperature.innerText, 'c');
      apparentTemperature.innerText = convertTemp(apparentTemperature.innerText, 'c');
      unit = 'f';
    }
  })

  convertDistanceBtn.addEventListener('click', function() {
    if (unit2 == 'miles') {
      windSpeed.innerText = convertDistance(windSpeed.innerText, 'miles');
      windUnit.innerText = ' kmph';
      visibility.innerText = convertDistance(visibility.innerText, 'miles');
      visUnit.innerText = ' km';
      unit2 = 'km';
    }
    else {
      windSpeed.innerText = convertDistance(windSpeed.innerText, 'km');
      windUnit.innerText = ' mph';
      visibility.innerText = convertDistance(visibility.innerText, 'km');
      visUnit.innerText = ' miles';
      unit2 = 'miles';
    }
  })

  refresh.addEventListener('click', function() {
    getWeather();
  })

  weatherInfo.classList.remove('blur');
  converters.classList.remove('blur');
}
