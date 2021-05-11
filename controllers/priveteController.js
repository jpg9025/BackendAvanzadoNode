'use strict';

class PrivateController {
    index(req, res, next) {
        if (!req.session.userLogged) {
            res.redirect('/login');
            return;
        }
        res.render('privado');
    }
}

module.exports = new PrivateController();