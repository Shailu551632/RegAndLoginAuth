const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// connecting to database

mongoose.connect('mongodb+srv://Shailu:Mangil20@nodedb.ccj5z.mongodb.net/?retryWrites=true&w=majority');

mongoose.connection.on('error', err => {
    console.log('Connection failed');
})

mongoose.connection.on('connected', connected => {
    console.log('Conection Successful.');
})

app.use(bodyParser.urlencoded({
    extended:false
}))

app.use(bodyParser.json());

const UserRoutes = require('./api/routes/UserRoutes')

app.use('/user', UserRoutes);

app.use( (req, res, next) => {
    res.status(404).json({
        error : 'Bad Request.'
    })
});

module.exports = app;