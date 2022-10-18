require('dotenv/config');

module.exports = {
    MYSQL_URI: process.env.MYSQL_URI,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_DB: process.env.MYSQL_DB,
    SECRET: process.env.SECRET_TOKEN
}