'use strict';

const jwt = require('jsonwebtoken');
const Usuario = require('../models/Users.js');

class LoginController {
    // GET/login
    index(req, res, next ) {
        res.locals.email='';
        res.locals.error='';
        res.render('login');
    }

    // POST/login
    async post(req, res, next) {
        try {
            const { email, password } = req.body;
            console.log(email, password);
            console.log(req.session);

            // Search user in DB
            // For filter using email. Email must have an index (unique: true) in the model (users.js)
            const usuario = await Usuario.findOne({email})

            // Token
            var tokenData = {
                email: email
            };
            var token = jwt.sign(tokenData, 'Secret Password', {expiresIn: 60 * 60 *24 * 2});


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
           
            // User found and right password
            res.redirect('/api/anuncios');
            

        } catch(error) {
            next(error);
        }
    }

    // GET/Logout
    logout(req, res, next) {
        req.session.regenerate(error => {
            if(error) {
                next(error);
                return;
            }
            res.redirect('/');
        });
    }
};

module.exports = new LoginController();