const express = require('express');
const bodyParser = require('body-parser');
const sdk = require('api')('@fsq-developer/v1.0#18rps1flohmmndw');
const morgan = require('morgan');
const latlong = require('./latlong.js');
const trainHandler = require('./trainHandler');
const hotelOptions = require('./hotel.js');
const stationcodes=require('./test.js');
const axios = require('axios');
const fs = require('fs');
const trainService=require('./Apis/trainfetch.js');

const app = express();
const PORT = process.env.PORT || 3000;

let expenses = [];

// Use morgan middleware for request logging
app.use(morgan('dev'));
app.use(bodyParser.json());

// Expenses App Routes
app.get('/expenses', (req, res) => {
    res.json(expenses);
});

app.post('/expenses', (req, res) => {
    console.log(req.headers);
    // Obtain the totalAmount from request headers
    const totalAmount = req.headers['totalamount']; // Adjust the header key as needed

    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
        return res.status(400).json({ error: 'Invalid total amount' });
    }

    const foodPercentage = 0.5;
    const utilitiesPercentage = 0.3;
    const entertainmentPercentage = 0.2;

    const foodAmount = totalAmount * foodPercentage;
    const utilitiesAmount = totalAmount * utilitiesPercentage;
    const entertainmentAmount = totalAmount * entertainmentPercentage;

    const newExpense = {
        id: expenses.length + 1,
        totalAmount,
        distribution: {
            food: foodAmount,
            utilities: utilitiesAmount,
            entertainment: entertainmentAmount,
        },
        date: new Date().toISOString(),
    };

    expenses.push(newExpense);

    // Return only the food, utilities, and entertainment amounts in the response
    res.status(201).json({
        foodAmount,
        utilitiesAmount,
        entertainmentAmount,
    });
});


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
      ``,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: '',
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
    sdk.auth('');
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

// Location App Routes
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
        // console.log(req.headers);
        const locationName = req.headers.location;
        const arrivalDate = req.headers.arrival_date;
        const departureDate = req.headers.departure_date;
        console.log(arrivalDate);
        console.log(departureDate);
        const hotelData = await hotelOptions.fetchHotelData(locationName, arrivalDate, departureDate);
        // console.log(hotelData);
        return res.status(200).json(hotelData);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
  }
});

app.post('/traindetails', async (req, res) => {
  try {
    console.log(req.headers);
    const fromstation = req.headers.fromstation;
    const tostation = req.headers.tostation;
    const dateofJourney=req.headers.traveldate;//yyyy-mm-dd
    // console.log(arrivalstation);
    // console.log(departurestation);
    const fromstationCode1 = stationcodes.getStationCodeByStationName(fromstation);
    const tostationCode2 = stationcodes.getStationCodeByStationName(tostation);

    if (fromstationCode1 && tostationCode2) {
      console.log(`Station Code for ${fromstation}: ${fromstationCode1}`);
      console.log(`Station Code for ${tostation}: ${tostationCode2}`);

      

      // Call the new function to fetch train details
      const trainDetails = await trainService.fetchTrainDetails(fromstationCode1, tostationCode2, dateofJourney);

      console.log(trainDetails);

      // Return the train details to the client
      res.status(200).json(trainDetails);
    } else {
      console.log("Station not found:");
      res.status(404).json({ error: 'Station not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
