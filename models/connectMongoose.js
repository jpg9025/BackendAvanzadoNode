'use strict'

const mongoose = require('mongoose');

// Create a message if there is an connection error
mongoose.connection.on('error', err => {
    console.log('Error de conexión', err);
    process.exit(1); // This app require BBDD without BBDD the application must fall, without BBDD its have no sense
});

mongoose.connection.once('open', () => {
    console.log('Conectado a la MongoDB en', mongoose.connection.name);
});

mongoose.connect('mongodb://localhost/cursonode', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = mongoose.connection;
