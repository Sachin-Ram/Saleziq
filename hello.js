const express = require('express');

    const request = require('request');
   

    const app = express();
    const bodyParser = require('body-parser');
    app.use(bodyParser);
    app.use(express.json());

    app.post('/', async (req, res) => {
    try {
    const locationName = req.body;
    console.log(req.body);
    res.status(200).json({requestBody: req.body});
    } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
    }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });