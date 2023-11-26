const express = require('express');
const app = express();
const sdk = require('api')('@fsq-developer/v1.0#18rps1flohmmndw');
const request = require('request');
const axios = require('axios');
const trainHandler = require('./trainHandler');
const hotelOptions = require('./hotel');
const latlong=require('./latlong.js');

// const getLocationDetails = async (locationName) => {
//   const options = {
//     method: 'GET',
//     url: 'https://trueway-geocoding.p.rapidapi.com/Geocode',
//     qs: {
//       address: locationName,
//       language: 'en'
//     },
//     headers: {
//       'X-RapidAPI-Key': '1fbcf9b118msh84d98293e865e42p1037e2jsn3f13e701b396',
//       'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com'
//     }
//   };

//   return new Promise((resolve, reject) => {
//     request(options, function (error, response, body) {
//       if (error) {
//         reject(error);
//       } else {
//         const locationData = JSON.parse(body).results[0].location;
//         resolve(locationData);
//       }
//     });
//   });
// };

const fetchData = async (locationName, spot) => {
  try {
    const locationDetails = await latlong.getLocationDetails(locationName);
    const spot_choosed = spot;
    const fetchModule = await import('node-fetch');
    const fetch = fetchModule.default;

    const searchParams = new URLSearchParams({
      query: spot_choosed,
      ll: `${locationDetails.lat},${locationDetails.lng}`,
      sort: 'DISTANCE'
    });

    const results = await fetch(
      `https://api.foursquare.com/v3/places/search?${searchParams}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'fsq3yWpaif7kLKFP+/GhiMQcnEIAyBRCUw/6LhMTnJBYNSk=',
        }
      }
    );

    const data = await results.json();
    const fsqIds = data.results.map(result => result.fsq_id);

    console.log('fsq_ids:', fsqIds);
    return fsqIds;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const fetchDetails = async (fsqId) => {
  try {
    sdk.auth('fsq3yWpaif7kLKFP+/GhiMQcnEIAyBRCUw/6LhMTnJBYNSk=');
    const placeDetails = await sdk.placeDetails({ fsq_id: fsqId });
    return {
      name: placeDetails.data.name,
      formatted_address: placeDetails.data.location.formatted_address
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

app.post('/', async (req, res) => {
  try {
    const locationName = req.headers.location;
    const spot = req.headers.spot;
    console.log(spot);
    const fsqIds = await fetchData(locationName, spot);
    const detailsPromises = fsqIds.map(fsqId => fetchDetails(fsqId));
    const details = await Promise.all(detailsPromises);
    return res.status(200).json(details);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
});

app.post('/recommend', async (req, res) => {
  try {
    const locationName = req.headers.location;
    const spot = req.headers.spot;
    console.log('Received Recommendation Request for Location:', locationName, 'and Spot:', spot);
    const fsqIds = await fetchData(locationName, spot);
    const detailsPromises = fsqIds.map(fsqId => fetchDetails(fsqId));
    const details = await Promise.all(detailsPromises);
    return res.status(200).json(details);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
});

app.post('/train', async (req, res) => {
  try {
    const locationName = req.headers.location;
    const trainData = await trainHandler.fetchTrainData(locationName);
    res.status(200).json(trainData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/hotel', async (req, res) => {
  try {
    const locationName=req.headers.location;
    // const arrivalDate = req.headers.arrivaldate;
    // const departureDate = req.headers.departuredate; 
    const hotelData = await hotelOptions.fetchHotelData(locationName);
    return res.status(200).json(hotelData);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


