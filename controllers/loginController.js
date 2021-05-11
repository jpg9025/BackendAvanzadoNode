'use strict';

const Usuario = require('../models/Users.js');

class LoginController {
    // GET /login
    index(req, res, next ) {
        res.locals.email='';
        res.locals.error='';
        res.render('login');
    }

    // POST /login
    async post(req, res, next) {
        try {
            const { email, password } = req.body;
            //console.log(email, password);

            // Search user in DB
            // For filter using email. Email must have an index (unique: true) in the model (users.js)
            const usuario = await Usuario.findOne({email})

            // User not found or bad password
            if(!usuario || !(await usuario.comparePassword(password)) ) {
                res.locals.email = email; // TODO include in the view
                res.locals.error='Invalid credentials';
                res.render('login');
                return;
            }

            // If user exist and passwords match, include in user session user_id
            req.session.userLogged = {
                _id: usuario._id
            };
            console.log('primavera rastrera');
            // User found and right password
            res.redirect('/privado');
            

        } catch(error) {
            next(error);
        }
        
    }
};

module.exports = new LoginController();