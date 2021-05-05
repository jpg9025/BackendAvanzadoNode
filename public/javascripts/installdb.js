'use strict';
const mongoose = require('mongoose');

// Import the model
const Anuncio = require('../../models/Anuncio.js');

// Import the samples file
const anuncios = require('../../anuncios.json');
const router = require('../../routes/index.js');

async function initDatabase() {
    try {
        mongoose.connect('mongodb://localhost/cursonode', {
        useNewUrlParser: true,
        useUnifiedTopology: true
        });
        // Remove all the records
        await mongoose.connection.dropCollection("anuncios");

        //Add sample data from anuncios.json
        for (let i= 0; i<anuncios.length;i++){
            const newAnuncio = Anuncio.create(anuncios[i]);
        };
        //res.status(201).json(); // Status 201 - Created
        console.log('Data base initialiced');

    } catch (error) {
        console.log("Error during database initialization", error);
    }
};

initDatabase();

module.exports = router;