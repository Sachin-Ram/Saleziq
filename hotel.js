const axios = require('axios');
const latlong = require('./latlong'); // Use require instead of request

const fetchHotelData = async (locationName,arrivalDate,departureDate) => {
  try {
    const locationDetails = await latlong.getLocationDetails(locationName);

    // Get arrival_date and departure_date from the request headers
    

    const options = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotelsByCoordinates',
      params: {
        latitude: locationDetails.lat,
        longitude: locationDetails.lng,
        arrival_date: arrivalDate,
        departure_date: departureDate,
        adults: '1',
        children_age: '0,17',
        room_qty: '1',
        languagecode: 'en-us',
        currency_code: 'EUR'
      },
      headers: {
        'X-RapidAPI-Key': '1fbcf9b118msh84d98293e865e42p1037e2jsn3f13e701b396', // Replace with your actual key
        'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);

    // Accessing properties from the JSON response
    const hotels = response.data.data.result;

    // Create an array to store hotel details
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
