var express = require('express');
var router = express.Router();
var rp = require('request-promise');
var config = require('../config');
var secretKey = config.secret;
var jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) { 
 
res.render('chatboard', {title: 'CHAT BOARD'});
   
});

module.exports = router;
