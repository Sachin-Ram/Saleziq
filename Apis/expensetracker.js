const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const PORT = 3000;

let expenses = [];

// Use morgan middleware for request logging
app.use(morgan('dev'));
app.use(bodyParser.json());

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

app.listen(PORT, () => {
    console.log(`Expense tracker server is running ${PORT}`);
});
