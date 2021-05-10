var express = require('express');
const { FailedDependency } = require('http-errors');
var router = express.Router();
const { query, validationResult } = require('express-validator');
const multer = require('multer');

/* Multer */
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null,path.join(__dirname, '../../public/images'))
      //cb(null, 'images') 
      //  destination: function (req, file, cb)
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('nuevoanuncio');
});

/* POST nuevo anuncio */
router.post('./api/anuncios', async (req, res, next) => {
  try {
    console.log('En nuevo anuncio')
    let upload = multer({storage}).single('photo')
    console.log('post a images')
    upload(req, res, function (error) {
      console.log(req)
      if(!req.file) {
        console.log(req.file)
        return res.status(400).json({ message: 'file is required' });
      } else if(error) {
        return res.status(400).json({ message: error })
      }
      return res.status(201);
    })
  } catch {
    next(error)
  }
});

module.exports = router;