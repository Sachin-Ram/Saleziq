const request = require('request');

const getLocationDetails = async (locationName) => {
  const options = {
    method: 'GET',
    url: 'https://trueway-geocoding.p.rapidapi.com/Geocode',
    qs: {
      address: locationName,
      language: 'en'
    },
    headers: {
      'X-RapidAPI-Key': '74a10f177emsh9fedb666587660fp12cd30jsn3145991e3f11',
      'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com'
    }
  };

  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) {
        reject(error);
      } else {
        const locationData = JSON.parse(body).results[0].location;
        resolve(locationData);
      }
    });
  });
};

module.exports = { getLocationDetails };
