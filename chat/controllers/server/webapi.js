var express = require('express');
var router = express.Router();

//var UserController = require('../controllers/UserController');

var config = require('../config');
var secretKey = config.secret;
var jwt = require('jsonwebtoken');
var UserController = require('../controllers/WebUserController');
var ContactController = require('../controllers/ContactController');

//======================
//  Middleware to check the login
//=========================

function checkToken(req, res, next){
    
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    //console.log(token);
    if(token){
        jwt.verify(token, secretKey, function(err, decoded){
            if(err){
                res.status(403).json({success: false, message: "failed to authenticate"});
            }
            else{
                req.user = decoded;    
                //console.log("req.user : ", req.user);            
                return next();
            }
        });
    }
    else{
        res.status(403).json({success: false, message: "token required"});
    }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.json({success: true, message: "api routes is working"});
});

router.post('/sign-up', function(req, res) {
  //res.render('index', { title: 'Express' });
  UserController.createNewUser(req.body, function(data){
      res.json(data);   
  })
});



router.post('/login', function(req, res) {
  console.log(req.body);
  UserController.doLogin(req.body, req.headers['user-agent'], function(data){
      var statusCode = config.status.OK;
      if(data.statusCode)
        statusCode = data.statusCode;
      res.status(statusCode).json(data);   
  });
});

router.patch('/do-reset-password', function(req, res, next) {
  //console.log(req.user);
  UserController.DoResetPassword(req.body, function(data){
    res.json(data); 
  })
  
});


router.post('/reset-page-access',function(req, res) {

  console.log(req.body);
  UserController.checkResetPasswordToken(req.body, req.headers['user-agent'], function(data){
      var statusCode = config.status.OK;
      if(data.statusCode)
        statusCode = data.statusCode;
      res.status(statusCode).json(data);   
  });

});


router.get('/me', checkToken, function(req, res, next) {
  //console.log(req.user);
  UserController.getMyDetails(req.user, function(data){
    res.json(data); 
  })
  
});

router.get('/getSettingData/:settingtype', checkToken, function(req, res, next) {
  console.log(req.params.settingtype);
  UserController.getSettingData(req.params.settingtype, function(data){
    res.json(data); 
  })
 
  
});

router.get('/getUserInfo/:id', checkToken, function(req, res, next) {

  UserController.getUserInfo(req, function(data){
    res.json(data); 
  })

});

router.post('/update-setting', checkToken, function(req, res, next) {

  UserController.updateSetting(req.body, function(data){
    res.json(data); 
  })

});




router.delete('/deleteUser/:id', checkToken, function(req, res, next) {
 
 
  UserController.deleteUser(req, function(data){
    res.json(data); 
  })

  
});

router.post('/addNewUser', checkToken, function(req, res, next) {
  //console.log(req.user);
  UserController.AddNewUser(req.body,function(data){
    res.json(data); 
  })
  
});

router.patch('/changepassword', checkToken, function(req, res, next) {
  //console.log(req.user);
  UserController.changeMyPassword(req.body, req.user, function(data){
    res.json(data); 
  })
  
});

router.put('/update-profile-informations', checkToken, function(req, res, next) {
  //console.log(req.user);
  UserController.updateProfileInformations(req.body, req.user, function(data){
    res.json(data); 
  })
});

router.put('/update-user-informations', checkToken, function(req, res, next) {
  //console.log(req.user);
  UserController.updateUserInformations(req.body, req.user, function(data){
    res.json(data); 
  })
});

router.post('/forgotpassword', function(req, res, next) {
  console.log(req.body);

  UserController.forgotMyPassword(req.body, function(data){
    res.json(data); 
  })


  
});



router.post('/alert', checkToken, function(req, res, next) {
  //console.log(req.user);
  UserController.alert(req.body, req.user, function(data){
    res.json(data); 
  })  
});




router.get('/all-alert', checkToken, function(req, res, next) {
  //console.log(req.user);
  UserController.getAllAlert(req.query, req.user, function(data){
    res.json(data); 
  })
  
});

router.post('/contact', checkToken, function(req, res) {
  //res.render('index', { title: 'Express' });
  
  ContactController.doSaveContact(req.body, req.user, function(data){
      var statusCode = config.status.OK;
      if(data.statusCode)
        statusCode = data.statusCode;
      res.status(statusCode).json(data);   
  });
});

router.put('/contact/:contact_id', checkToken, function(req, res) {
  //res.render('index', { title: 'Express' });
  //console.log("req.params.contact_id : ", req.params.contact_id);
  var contact_id = req.params.contact_id;
  ContactController.updateContact(contact_id, req.body, req.user, function(data){
      var statusCode = config.status.OK;
      if(data.statusCode)
        statusCode = data.statusCode;
      res.status(statusCode).json(data);   
  });
});

router.put('/smstext/:contact_id', checkToken, function(req, res) {
  var contact_id = req.params.contact_id;
  ContactController.updateText(contact_id, req.body, function(data){
      var statusCode = config.status.OK;
      if(data.statusCode)
        statusCode = data.statusCode;
      res.status(statusCode).json(data);   
  });
});

router.delete('/contact/:contact_id', checkToken, function(req, res) {
  //res.render('index', { title: 'Express' });
  var contact_id = req.params.contact_id;
  ContactController.removeContact(contact_id, req.user, function(data){
      var statusCode = config.status.OK;
      if(data.statusCode)
        statusCode = data.statusCode;
      res.status(statusCode).json(data);   
  });
});

router.delete('/contact', checkToken, function(req, res) {
  //res.render('index', { title: 'Express' });  
  ContactController.removeAllContact(req.user, function(data){
      var statusCode = config.status.OK;
      if(data.statusCode)
        statusCode = data.statusCode;
      res.status(statusCode).json(data);   
  });
});

router.get('/user-list', checkToken, function(req, res) {
  //res.render('index', { title: 'Express' });  
  UserController.getAlluser(req.user, function(data){
      var statusCode = config.status.OK;
      if(data.statusCode)
      statusCode = data.statusCode;
      res.status(statusCode).json(data);   
  });


});

router.get('/my-contacts', checkToken, function(req, res) {
  //res.render('index', { title: 'Express' });
  
  ContactController.myContacts(req.user, function(data){
      var statusCode = config.status.OK;
      if(data.statusCode)
        statusCode = data.statusCode;
      res.status(statusCode).json(data);   
  });

});

module.exports = router;