const request = require('request');

const options = {
  method: 'GET',
  url: 'https://trueway-geocoding.p.rapidapi.com/Geocode',
  qs: {
    address: 'madurai',
    language: 'en'
  },
  headers: {
    'X-RapidAPI-Key': '1fbcf9b118msh84d98293e865e42p1037e2jsn3f13e701b396',
    'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com'
  }
};

request(options, function (error, response, body) {
	if (error) throw new Error(error);

	console.log(body);
});