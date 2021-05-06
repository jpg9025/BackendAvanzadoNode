'use strict'

const cote = require('cote');
const jimp = require('jimp/es');
// Service that receive a pic and return a thumbnail of the pic

// Declaration of microservice
const responder = new cote.Responder({ name: 'thumbnail creator'});

// Conversion
const rates = {
    usd_eur: 0.86,
    eur_usd: 1.14
}

//Microservice logic
responder.on('createThumbnail', (req, done) => {
    console.log('service:', req.from, req.to, Date.now());
    const result = rates[`${req.from}_${req.to}`];

    done(result);
});