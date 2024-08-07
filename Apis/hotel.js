const axios = require('axios');
const latlong = require('./latlong');

const fetchHotelData = async (locationName, arrivalDate, departureDate) => {
  try {
    const locationDetails = await latlong.getLocationDetails(locationName);

    const options = {
      method: 'GET',
      url: '',
      params: {
        latitude: locationDetails.lat,
        longitude: locationDetails.lng,
        arrival_date: arrivalDate,
        departure_date: departureDate,
        adults: '2', // Adjusted to '2' adults
        children_age: '0',
        room_qty: '1',
        languagecode: 'en-us',
        currency_code: 'INR', // Adjusted to 'INR'
      },
      headers: {
        'X-RapidAPI-Key': '', // Replace with your actual key
        'X-RapidAPI-Host': '',
      },
    };

    const response = await axios.request(options);
    const hotels = response.data.data.result;

    const hotelDetails = hotels.map(hotel => ({
      hotel_id: hotel.hotel_id,
      hotel_name: hotel.hotel_name,
      review_nr: hotel.review_nr,
      review_score: hotel.review_score,
    }));

    return hotelDetails;
  } catch (error) {
    throw error;
  }
};

module.exports = { fetchHotelData };
