'use strict';

class PrivateController {
    index(req, res, next) {
        res.render('privado');
    }
}

module.exports = new PrivateController();