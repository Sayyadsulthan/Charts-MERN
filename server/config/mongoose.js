const mongoose = require('mongoose');
const env = require('./environment.js');
const Transaction = require('../models/Transaction.js');
const data = require('../utils/data.json');

mongoose
    .connect(env.DB_URI)
    .then(async () => {
        console.log('db connection successfull...');
        /*
        // use only once while insert data
        try {
            await Transaction.insertMany(data);
        } catch (error) {
            console.log('Error while insering the data');
        }
        */
    })
    .catch((err) => console.log('error in db connection: ', err.message));

module.exports = mongoose;
