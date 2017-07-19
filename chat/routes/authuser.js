var express = require('express');
var router = express.Router();
var rp = require('request-promise');
var config = require('../config');
var secretKey = config.secret;
var jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) { 
 
  var sessionid=req.query.token;
  
  var options = {
			method: 'POST',
			uri: 'http://192.168.1.7/webrtc/cake/api/authuser',
			form: {
				token: sessionid
			},
			headers: {
				 'content-type': 'application/x-www-form-urlencoded'
			},
			json: true
		};
 
		rp(options)
		.then(function (repos) {

			if(repos.success && repos.data.User){
				var tokenData = repos.data.User;
				
				var token = jwt.sign(tokenData, secretKey, {
					expiresIn: "30 days"
				});
				
				res.redirect('/chatboard');
				

			}else{
				
				res.redirect('http://192.168.1.7');
				
			}
		})
		.catch(function (err) {
			console.log('err', err);
		});
  
  
   
  
  
});

module.exports = router;
