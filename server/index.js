const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const PORT = process.env.PORT || 8000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => console.log('Server is running on Port :', PORT));
