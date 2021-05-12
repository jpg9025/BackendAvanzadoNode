'use strict'

const cote = require('cote');
const jimp = require('jimp/es');
// Service that receive a pic and return a thumbnail of the pic

// Declaration of microservice
const responder = new cote.Responder({ name: 'thumbnail creator'});

//Microservice logic
responder.on('createThumbnail', async (req, done) => {
    console.log('thumbnail request', req);
    const photo = req;

    // Resize the photo
    jimp.read(photo).then((photoToResize) => {
        photoToResize.resize(100,100).write(`thumbnail-${photo}.jpg`)
    }).catch((error) => {console.log(error)});

    const result = 'thumbnail creator';
    
    await done(result);
});
