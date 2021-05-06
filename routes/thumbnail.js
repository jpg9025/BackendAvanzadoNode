var express = require('express');
var router = express.Router();
const cote = require('cote');

const requester = new cote.Requester({ name: 'thumbnail customer'});

/* GET /thumbnail */ 
router.get('/:from/:to', function(req, res, next) {
    const { from, to } = req.params;

    requester.send({
        type: 'thumbnail creator',
        from: from,
        to: to,
    }, result => {
        res.send('bla bla bla');
    })
});

module.exports = router;