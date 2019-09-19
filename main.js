/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-undef */
// file for interactive parts of our chrome extension
// const apiKey = "M2ZCyJUXPgf2M1Zb7xiyebStEAVNKyEy";
// const apiKeyOld = "dUf4Saq3DJe5rQuBUiEWMli0SRSYmwci";
const apiKey = "wDmYC4Ea6HXDOKCElV5zWo5EzT0thJPF"; //prasmalla
const zipcodesInputArray = ["10018", "10911", "11224", "11954"];

// we will have inputs for a few zip codes
// const zipcode1 = '10018';
const zipcodesAndKeys = {};
const weatherDetails = {};

// counter to detect when to delete template node
let counter = 0;

// those zip codes will be fed into a fetch to the accuweather api to get their unique location keys
// then in the last fetch.then.then the helper will be invoked to populate our weatherDetails object
function fillWeatherDetailsObj(zCode) {
  // zCode must got in as a string!
  // fetch from accuweather location api
  const locateUrl = `http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=${apiKey}&q=${zCode}`;
  fetch(locateUrl)
    .then(response => response.json())
    .then(data => {
      zipcodesAndKeys[zCode] = data[0].Key;
      // return data[0].Key;
      // eslint-disable-next-line no-use-before-define
      fillWeatherDetailsHelper(
        data[0].Key,
        zCode,
        data[0].EnglishName,
        data[0].AdministrativeArea.EnglishName
      );
    });
}

// those location keys will be fed into a fetch request for the next 5 day forecast
function fillWeatherDetailsHelper(locationKey, zipcode, cityName, stateName) {
  // fetch from accuweather 5 day weather api
  const fiveDayUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`;

  fetch(fiveDayUrl)
    .then(response => response.json())
    .then(weatherData => {
      weatherDetails[zipcode] = {
        location: `${cityName}, ${stateName}`,
        weatherInfo: weatherData.DailyForecasts
      };
      // invoke helper to fill html doc
      // invoke with zcode fed in
      // eslint-disable-next-line no-use-before-define
      populateHTML(zipcode);
    });
}

function populateHTML(zipcode) {
  // copy the prototype in the html and set it to some variable
  // console.log("reached here", zipCodes);
  const working = document.getElementById("location").cloneNode(true);
  working.id = "newLocation";
  document.getElementById("results").appendChild(working);
  const label = weatherDetails[zipcode];
  // working.style.height = '250px';
  // working.querySelector('.locationName').style.height = '21px';
  // working.querySelector('ul').style.height = '200px';

  counter += 1;
  if (counter === 4) {
    document.getElementById("location").remove();
  }

  // 'New York, NY 10018'
  const locationText = `${label.location} ${zipcode}`;
  working.childNodes[1].innerText = locationText;

  // Things that we care about for each of the days, set the array
  const weatherInfoArray = label.weatherInfo;
  // console.log(weatherInfoArray);

  // // set pointer to the div in the html file that has the five day panels
  // document.getElementById(`location${1}`);

  weatherInfoArray.forEach((e, ind) => {
    // find the workingDay class
    const workingDay = working.querySelector(`.day${ind + 1}`);

    // get date for the current day
    const date = e.Date.slice(0, 10);
    workingDay.querySelector("h4").innerText = date;

    // console.log(locationText, date);

    // max and min temperatures weatherInfo[index].Temperature.Minimum.Value and replace with Maximum (all in Farinehit)
    const maxTemp = e.Temperature.Maximum.Value;
    const minTemp = e.Temperature.Minimum.Value;
    workingDay.querySelector(".min").innerText = `Max: ${minTemp} F  `;
    workingDay.querySelector(".max").innerText = `Min: ${maxTemp} F`;

    // is it raining?! weatherInfo[index].Day.HasPreciptation & weatherInfo[index].Night.HasPrecipitation
    // THESE ARE BOTH BOOLEANS
    const rainValueDay = e.Day.HasPrecipitation;
    const rainValueNight = e.Night.HasPrecipitation;
    workingDay.querySelector(".rain").innerText = `Rain? ${
      rainValueNight || rainValueDay ? "yup :(" : "nope :)"
    }`;
    // console.log(typeof rainValueDay, typeof rainValueNight);

    // sunny? conditions: weatherInfo[index].Day.IconPhrase & weatherInfo[index].Night.IconPhrase
    const iconPhraseDay = e.Day.IconPhrase;
    const iconPhraseNight = e.Night.IconPhrase;
    // console.log(iconPhraseDay, iconPhraseNight);
    workingDay.querySelector(".day").innerText = `Day: ${iconPhraseDay}`;
    workingDay.querySelector(".night").innerText = `Night: ${iconPhraseNight}`;
  });
}

// document.addEventListener('DOMContentLoaded', () => {
// fillWeatherDetailsObj('10018');
// invoke fillWeatherObj on each zipcode from the form
// console.log('hi again');
// zipcodesInputArray.forEach(e => fillWeatherDetailsObj(e));
Object.values(zipCodes).forEach(zip => fillWeatherDetailsObj(zip));
// });

// smash the template id to a height of 0
// document.getElementById('location').style.height = '0px';
// document.getElementById('locationName').style.height = '0px';
// document.getElementById('5days').style.height = '0px';
