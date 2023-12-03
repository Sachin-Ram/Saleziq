const express = require('express');
const request = require('request');
const app = express();
// Middleware to parse JSON request body
app.use(express.json());

const fs = require('fs');
function loadStationData() {
  try {
    const data = fs.readFileSync('stations.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading or parsing station data:', err);
    return null;
  }
}
function getStationCodeByStationName(targetStation) {
  const jsonData = loadStationData();

  if (!jsonData) {
    console.error('Error loading station data');
    return null;
  }

  const lowercasedTargetStation = targetStation.toLowerCase();

  for (const entry of jsonData) {
    if (entry.station.toLowerCase() === lowercasedTargetStation) {
      return entry.station_code;
    }
  }
  return null; // Return null if station is not found
}



module.exports = { getStationCodeByStationName };



// const axios = require('axios');

// const options = {
//   method: 'GET',
//   url: 'https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations',
//   params: {
//     fromStationCode: 'MDU',
//     toStationCode: 'MAS',
//     dateOfJourney: '2023-12-06'
//   },
//   headers: {
//     'X-RapidAPI-Key': '1bfa42aa46mshd8174ea1fc822dfp13e806jsn163263fc73b1',
//     'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
//   }
// };

// try {
// 	const response = await axios.request(options);
// 	console.log(response.data);
// } catch (error) {
// 	console.error(error);
// }