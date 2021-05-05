'use strict'
const mongoose = require ('mongoose');

// Create the schema
const anuncioSchema = mongoose.Schema({
    name: { type: String, index: true },
    price: {type: Number, index: true }, // age: {type: Number}
    sale: {type: Boolean, index: true },
    location: {type: String, index: true},
    photo: {type: String},
    tags: {type: Array, index: true}
}, {
    collection: 'anuncios' // without this name, mongoose will plurify the name of the model - Anuncio to name the collection
});

// Do not use Arrow Function in mongoose methods. Mongoose uses 'this' and the Arrow Function asign the 'this' of current context 
anuncioSchema.statics.lista = function(filtro, limit, skip, fields, sort) {
    const query = Anuncio.find(filtro);
    query.limit(limit);
    query.skip(skip);
    query.select(fields);
    query.sort(sort);
    return query.exec();
};

// If the user does not specify the status sale, it will be true
anuncioSchema.methods.onsale = function() {
    this.sale = true;
    return this.save(); // save returns a promise, we want that the method onsale returns a promise, then we use the promise from onsale
}

// Create the model using the schema
const Anuncio = mongoose.model('Anuncio', anuncioSchema);

// Export the model
module.exports = Anuncio;