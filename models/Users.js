'use strict'

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// For filter in loginController using email. Email must have an index (unique) in the model
const usuarioSchema = mongoose.Schema({
    email: { type: String, unique: true },
    password: String
});

usuarioSchema.statics.hashPassword = function(passwordNotEncrypted) {
    return bcrypt.hash(passwordNotEncrypted, 7); //bcrypt.hash params, 1 - var to encrypt, 2 - a number, how many times the var must be encrypted
};

usuarioSchema.methods.comparePassword = function(passwordNotEncrypted) {
    return bcrypt.compare(passwordNotEncrypted, this.password);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
