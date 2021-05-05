var express = require('express');
var router = express.Router();

// GET /change-locale/:locale
router.get('/:locale', function(req, res, next) {
    // Set a cookie with the language requried and redirect to previous page
    const locale = req.params.locale;
    res.cookie('expresspop-locale', locale, { maxAge:1000*60*60*24 });
    res.redirect(req.get('referer'));
});

module.exports = router;