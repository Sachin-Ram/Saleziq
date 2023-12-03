const axios = require('axios');

const fetchTrainDetails = async (fromstationCode1, tostationCode2, dateOfJourney) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations',
      params: {
        fromStationCode: fromstationCode1,
        toStationCode: tostationCode2,
        dateOfJourney: dateOfJourney
      },
      headers: {
        'X-RapidAPI-Key': '1bfa42aa46mshd8174ea1fc822dfp13e806jsn163263fc73b1',
        'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    const trainDetails = response.data.data.map(train => ({
        train_number: train.train_number,
        train_name: train.train_name,
        from_station: train.from_station_name,
        to_station: train.to_station_name,
      }));
    return trainDetails;
  } catch (error) {
    throw error;
  }
};

module.exports = { fetchTrainDetails };
