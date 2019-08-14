require('dotenv').config({
    path: require('path').join(__dirname, '../.env')
});

const { Sequelize, DataTypes } = require('sequelize');
const { User } = require('../models');
const sequelize = new Sequelize({
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    define: {
        underscored: true
    },
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    dialect: 'postgres'
});

module.exports = {
    User: User(sequelize, DataTypes),
    sequelize
};
