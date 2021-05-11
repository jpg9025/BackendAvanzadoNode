'use strict';

const mongoose = require('../../models/connectMongoose.js');
const Usuario = require('../../models/Users.js');

const router = require('../../routes/index.js');

main().catch(error => console.log(error));

async function main() {
    //Inicializar colección de usuarios
    await initUsuarios();

    mongoose.close(); // do not use mongoose.connection.close(), connectMongoose.jse xports mongoose.connection
}

async function initUsuarios() {
    const { deletedCount } = await Usuario.deleteMany();
    console.log(`Eliminados ${deletedCount} usuarios`);

    const result = await Usuario.insertMany(
        {
            email: 'admin@example.com',
            password: await Usuario.hashPassword('1234')
        }
    );
    console.log(`insertados ${result.length} usuarios`);
    //console.log(result);
};

module.exports = router;
