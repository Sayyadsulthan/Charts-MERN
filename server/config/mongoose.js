const mongoose = require('mongoose');
const env = require('./environment.js');

mongoose
    .connect(env.DB_URI)
    .then(() => console.log('db connection successfull...'))
    .catch((err) => console.log('error in db connection: ', err.message));

module.exports = mongoose;
