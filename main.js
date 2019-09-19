/* eslint-disable no-undef */
// file for interactive parts of our chrome extension

// we will have inputs for a few zip codes
const zipcode1 = '10018';
const zipcodesArr = [];

// those zip codes will be fed into a fetch to the accuweather api to get their unique location keys
function getLocationCode(zCode) {
  // fetch from accuweather location api
  const url = `https://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=dUf4Saq3DJe5rQuBUiEWMli0SRSYmwci&q=${zCode}`;
  fetch(url)
    .then(response => response.json())
    .then((data) => {
      zipcodesArr.push(data[0].Key);
      // return data[0].Key;
    });
}

// example tests
getLocationCode(zipcode1);

const weatherDetails = {};
// those location keys will be fed into a fetch request for the next 5 day forecast
zipcodesArr.forEach((ele) => {
  // fetch from accuweather 5 day weather api
  const fiveDayUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${ele}?apikey=dUf4Saq3DJe5rQuBUiEWMli0SRSYmwci`;

  fetch(fiveDayUrl)
    .then(response => response.json())
    .then((weatherData) => {
      weatherDetails[ele] = weatherData.DailyForecasts;
    });
  // weatherDetails[ele]
});
