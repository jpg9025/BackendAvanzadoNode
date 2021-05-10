var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/star', (req, res, next) => {
  res.send('llamada a star')
});

module.exports = router;