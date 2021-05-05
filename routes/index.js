var express = require('express');
const { FailedDependency } = require('http-errors');
var router = express.Router();
const { query, validationResult } = require('express-validator');

const anuncios = require('../anuncios.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.locals.imageintro = {
    photo: "imageintro.jpg"
  };
  res.render('index');
});

module.exports = router;
