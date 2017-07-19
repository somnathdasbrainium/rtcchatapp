var express = require('express');
var router = express.Router();
var config = require('../config');
var secretKey = config.secret;
var jwt = require('jsonwebtoken');
var AdminController = require('../controllers/AdminController');
var sess;
/* GET user login. */
router.get('/pugexample', function(req, res, next) {
  res.render('index', { title: 'Hey Hey Hey!', message: 'Yo Yo'});
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Please put some valid URL.');
});

router.get('/login', function(req, res, next) {
  sess = req.session;
  if(!sess.uid){
    res.render('login');       
  }else{
    res.redirect('/users/dashboard');
  }
  
});

router.post('/checklogin', function(req, res, next) {
  sess = req.session;  
   AdminController.doAdminLogin(req.body, function(data){
      if(data.statusCode == 200){        
          sess.uid=data.data._id;
          res.redirect('/users/dashboard');                                   
          
      }else{
          res.render('login', {message: 'Sorry! You are not allowed.', url: req.originalUrl});
      }       
  });
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  sess = req.session;
  console.log(sess)
  if(typeof(sess) == "undefined" || sess.uid == null){
     res.render('login', {url: req.originalUrl});  
  }else{
    res.redirect('/users/dashboard'); 
  }
});

router.get('/dashboard', function(req, res, next) {
  sess = req.session;
  console.log(sess.uid);
  if(sess.uid == null){
    res.render('login', {url: req.originalUrl});  
  } else{
     AdminController.getUsersList(function(data1){
        if(data1.statusCode == 200){
          res.render('home', {userList: data1.data, url: req.originalUrl});
        }else{
          res.render('home', {msg: data1.message, url: req.originalUrl});
        }
      });
  }
 
});

router.get('/add', function(req, res, next) {
  sess = req.session;  
    if(sess.uid == null){
      res.render('login', {url: req.originalUrl});  
    } else{ 
      res.render('add', {message: '', url: req.originalUrl});
    }
});

router.post('/add-user', function(req, res, next) {
   sess = req.session;  
    if(sess.uid == null){
      res.render('login', {url: req.originalUrl});  
    } else{ 
      AdminController.addUser(req.body, function(data){
        if(data.statusCode == 200){
          res.redirect('/users/dashboard');
        }else{
          res.render('add', {message: data.message, url: req.originalUrl});
        }
      });
    } 
});

router.get('/edit-user/:userid', function(req, res, next) {
   sess = req.session;  
  if(sess.uid == null){
    res.render('login', {url: req.originalUrl});  
  } else{ 
    AdminController.getUserDetails(req.params.userid, function(data){
      if(data.statusCode == 200){
        res.render('edit', {user: data.data, url: req.originalUrl});
      }else{
        //
      }
    });
  }  
});

router.post('/update-user/:userid', function(req, res, next) {
   sess = req.session;  
  if(sess.uid == null){
    res.render('login', {url: req.originalUrl});  
  } else{ 
    AdminController.editUserDetails(req.params.userid, req.body, function(data){
      if(data.statusCode == 200){
        res.redirect('/users/dashboard');
      }else{
        res.render('edit', {message: data.message, url: req.originalUrl});
      }
    }); 
  } 
});

router.get('/delete-user/:userid', function(req, res, next) { 
  //res.send(req.params.userid);

  /*
  var conf = confirm("Are you sure you want to delete this user?");
  //var conf = true;
  if(conf){*/
    AdminController.deleteUser(req.params.userid, function(data){
      if(data.statusCode == 200){
        res.redirect('/users/dashboard');
      }else{
        //
      } 
    });
  //} 
});

router.get('/block-user/:userid', function(req, res, next) { 
  res.send(req.params.userid);
});

router.get('/go-change-pass', function(req, res, next) {
    sess = req.session;  
    if(sess.uid == null){
      res.render('login', {url: req.originalUrl});  
    } else{ 
      res.render('changepass', {message: '', url: req.originalUrl})
    }
});

router.post('/change-pass', function(req, res, next) {
   sess = req.session;  
  if(sess.uid == null){
    res.render('login', {url: req.originalUrl});  
  } else{ 
      AdminController.changeAdminPass(req.body, sess.uid, function(data){
        if(data.statusCode == 200){
        AdminController.getUsersList(function(data1){
            if(data1.statusCode == 200){
              res.render('home', {userList: data1.data, url: req.originalUrl});
            }else{
              res.render('home', {msg: data1.message, url: req.originalUrl});
            }
          })
        }else{
          res.render('changepass', {message: data.message, url: req.originalUrl});
        }
      });
  }  
});

router.get('/editprofile', function(req, res, next) {
  sess = req.session;  
    if(sess.uid == null){
      res.render('login', {url: req.originalUrl});  
    } else{
       AdminController.getUserDetails(sess.uid, function(data){
        if(data.statusCode == 200){        
           res.render('editprofile', {message: '', user: data.data, url: req.originalUrl});
        }
       });
    }
});

router.post('/edit-admin-profile', function(req, res, next) {
   sess = req.session;  
  if(sess.uid == null){
    res.render('login', {url: req.originalUrl});  
  } else{ 
      AdminController.editAdminProfile(req.body, sess.uid, function(data){
        if(data.statusCode == 200){
        AdminController.getUsersList(function(data1){
            if(data1.statusCode == 200){
              res.render('home', {userList: data1.data, url: req.originalUrl});
            }else{
              res.render('home', {msg: data1.message, url: req.originalUrl});
            }
          })
        }else{
          res.render('editprofile', {message: data.message, url: req.originalUrl});
        }
      });
  }  
});



module.exports = router;
