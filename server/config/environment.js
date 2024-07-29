require('dotenv').config();

const env = {
    PORT: process.env.PORT || 8000,
    DB_URI: process.env.DB_URI || 'mongodb://127.0.0.1:27017/chart-api',
};

module.exports = env;
