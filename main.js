/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-undef */
// file for interactive parts of our chrome extension

// we will have inputs for a few zip codes
// const zipcode1 = '10018';
const zipcodesAndKeys = {};
const weatherDetails = {};

// those zip codes will be fed into a fetch to the accuweather api to get their unique location keys
// then in the last fetch.then.then the helper will be invoked to populate our weatherDetails object
function fillWeatherDetailsObj(zCode) {
  // zCode must got in as a string!
  // fetch from accuweather location api
  const locateUrl = `http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=dUf4Saq3DJe5rQuBUiEWMli0SRSYmwci&q=${zCode}`;
  fetch(locateUrl)
    .then(response => response.json())
    .then((data) => {
      zipcodesAndKeys[zCode] = data[0].Key;
      // return data[0].Key;
      // eslint-disable-next-line no-use-before-define
      fillWeatherDetailsHelper(data[0].Key, zCode, data[0].EnglishName, data[0].AdministrativeArea.EnglishName);
    });
}

// those location keys will be fed into a fetch request for the next 5 day forecast
function fillWeatherDetailsHelper(locationKey, zipcode, cityName, stateName) {
  // fetch from accuweather 5 day weather api
  const fiveDayUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=dUf4Saq3DJe5rQuBUiEWMli0SRSYmwci`;

  fetch(fiveDayUrl)
    .then(response => response.json())
    .then((weatherData) => {
      weatherDetails[zipcode] = {
        location: `${cityName}, ${stateName}`,
        weatherInfo: weatherData.DailyForecasts,
      };
      // invoke helper to fill html doc
      // invoke with zcode fed in
      // eslint-disable-next-line no-use-before-define
      populateHTML(zipcode);
    });
}

function populateHTML(zipcode) {
  const label = weatherDetails[zipcode];

  // 'New York, NY 10018'
  const locationText = `${label.location} ${zipcode}`;

  // Things that we care about for each of the days
  const weatherInfoArray = label.weatherInfo;
  // console.log(weatherInfoArray);
  weatherInfoArray.forEach((e, ind) => {
    // get date for the current day
    const date = e.Date.slice(0, 10);

    // max and min temperatures weatherInfo[index].Temperature.Minimum.Value and replace with Maximum (all in Farinehit)
    const maxTemp = e.Temperature.Maximum.Value;
    const minTemp = e.Temperature.Minimum.Value;

    // is it raining?! weatherInfo[index].Day.HasPreciptation & weatherInfo[index].Night.HasPrecipitation
    // THESE ARE BOTH BOOLEANS
    const rainValueDay = e.Day.HasPrecipitation;
    const rainValueNight = e.Night.HasPrecipitation;
    // console.log(typeof rainValueDay, typeof rainValueNight);

    // sunny? conditions: weatherInfo[index].Day.IconPhrase & weatherInfo[index].Night.IconPhrase
    const iconPhraseDay = e.Day.IconPhrase;
    const iconPhraseNight = e.Night.IconPhrase;
    console.log(iconPhraseDay, iconPhraseNight);
  });
}

// fillWeatherDetailsObj('10018');
// invoke fillWeatherDetails on each zipcode from the form
