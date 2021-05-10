var express = require('express');
const { FailedDependency } = require('http-errors');
var router = express.Router();
const { query, validationResult } = require('express-validator');
const Anuncio = require('../models/Anuncio.js');

/* GET home page. */
router.get('/:image?', async (req, res, next) => {
  try {
    const image = req.query.image;
    const anuncio = await Anuncio.findOne({ name: image });
    if (!anuncio) {
      return res.status(400).json({ error: ' Bad Request - there is not product with this name '}); 
    }
    res.locals.anuncio = {
      name: anuncio.name, 
      price: anuncio.price,
      location: anuncio.location,
      photo: anuncio.photo,
      sale: anuncio.sale,
      tags: anuncio.tags
    }
  } catch (error) {
    next(error);
  }
  res.render('imagenes');
});

module.exports = router;