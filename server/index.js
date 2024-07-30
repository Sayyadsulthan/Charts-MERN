// importing the required modules and libs
const express = require('express');
const bodyParser = require('body-parser');
const env = require('./config/environment.js');
const db = require('./config/mongoose.js');
const {
    getTransactions,
    getStatistics,
    getBarChartData,
    getPieData,
    getChartData,
} = require('./controllers/transactionController.js');
require('./models/Transaction.js');

const PORT = env.PORT;
const app = express();
// using the middlewares / configure
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// the api routes
// this is for checking or filtering the transaction in query
// the  fromMonth, toMonth is required
// other is optionals
app.get('/api/transactions', getTransactions);
// the below data need to pass month in query
app.get('/api/stastics', getStatistics);
app.get('/api/bar-data', getBarChartData);
app.get('/api/pie-data', getPieData);
// the final api this will call 3 api's stastics, bar-data and pie-data and combines
app.get('/api/chart-data', getChartData);

app.listen(PORT, () => console.log('Server is running on Port :', PORT));
