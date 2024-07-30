// importing the required modules and libs
const express = require('express');
const bodyParser = require('body-parser');
const env = require('./config/environment.js');
const db = require('./config/mongoose.js');
const {
    getTransactions,
    getStatistics,
    getBarChartData,
} = require('./controllers/transactionController.js');
require('./models/Transaction.js');

const PORT = env.PORT;
const app = express();
// using the middlewares / configure
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api/transactions', getTransactions);
app.get('/api/stastics', getStatistics);
app.get('/api/bar-data', getBarChartData);

app.listen(PORT, () => console.log('Server is running on Port :', PORT));
