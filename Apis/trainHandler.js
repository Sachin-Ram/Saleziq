// trainHandler.js

const axios = require('axios');

const fetchTrainData = async (location) => {
  const options = {
    method: 'POST',
    url: 'https://trains.p.rapidapi.com/',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': '',
      'X-RapidAPI-Host': 'trains.p.rapidapi.com'
    },
    data: { search: location }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports = { fetchTrainData };
