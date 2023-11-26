const sdk = require('api')('@fsq-developer/v1.0#18rps1flohmmndw');

sdk.auth('fsq3yWpaif7kLKFP+/GhiMQcnEIAyBRCUw/6LhMTnJBYNSk=');
sdk.placeDetails({fsq_id: '5bba252b73fe25002c9b9581'})
  .then(({ data }) => console.log(data))
  .catch(err => console.error(err));