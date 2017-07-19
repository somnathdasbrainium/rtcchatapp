/*
 *   User Manipulation Services for App.
 */

var async = require('async');
var config = require('../config');

var secretKey = config.secret;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var UserModel = require('../models/UserModel');
var ContactModel = require('../models/ContactModel');
var AlertModel = require('../models/AlertModel');
var SettingsModel = require('../models/SettingsModel');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var randomstring = require("randomstring");
var dateFormat = require('dateformat');
var geolib = require('geolib');
var request = require('request');

function createToken(user){    
    var tokenData = {
        id: user._id,
        username: user.username,
        name: user.name
    };

    var token = jwt.sign(tokenData, secretKey, {
        expiresIn: "30 days"
    });
    return token;    
}

function sendPushNotification(notify){    
    
    var pushConfig = config.push.IONIC;
    var device_android = [], device_ios = [], device_tokens = [];;
    if(config.pushOpt == 'IONIC'){
        
        /**
         * Push through IONIC Cloud
         */
        
        pushConfig = config.push.IONIC;
        
        if(notify.deviceDetails.length > 0){
            notify.deviceDetails.forEach(function(device){
                device_tokens.push(device.deviceToken);
            });
        }
        
        if(device_tokens.length > 0){
            request.post({
                uri: pushConfig.requestUrl,
                headers: {
                    "Authorization": "Bearer " + pushConfig.apiKey,
                    "Content-Type": "application/json"
                },
                body: {
                    //"tokens": "dDu7e0OEA3o:APA91bH37ji3SLngcd5S2sId_f7YBRzGP6BA21STQ5FF93DKRwv_gY6W-piNIcQ1eno5xJPzRbFR6R36dJd1wVpmhud-44Ax3Cm9gYlrWG81NO2bUMBBUtcxuS4VKv3ZEP7agbxBdLRM",
                    "tokens": device_tokens,
                    "profile": pushConfig.profileName,
                    "notification": {
                        "message": notify.message,
                        "payload": {"type": notify.type, "latitude": notify.latitude, "longitude": notify.longitude}
                    }
                },
                json: true
            }, function (err, response, body) {
                if (err) {
                    //res.json(err);
                    //nextcb(err);
                    console.log(err);
                } else {
                    console.log(body);
                }
            });
        }        
        
    } else {
        
        /**
         * Push through GCM & APNS
         
        var userAgent = notify.userAgent;
        
        if(notify.deviceDetails.length > 0){
            notify.deviceDetails.forEach(function(device){
                if(device.deviceType == "Android")
                    device_android.push(device.deviceToken);
                else if(device.deviceType == "iOS")
                    device_ios.push({token: device.deviceToken, badge: device.currentBadgeCount});
            });
        }
        //console.log("\n=====notify========\n", notify);
        //console.log("\n======device_android=======\n", device_android);
        //console.log("\n======device_ios=======\n", device_ios);
        
        if(device_android.length > 0){      //======= Android Push ========//
            var requestBody = {
                    "registration_ids": device_android,
                    "data": {
                        title: notify.title,
                        message: notify.content,
                        "vibrate": 1,
                        "sound": "brass",
                        "image": notify.image,
                        "largeIcon": "icon",
                        "smallIcon" : "icon"
                    }
                };
                
            request.post({
                uri: pushConfig.requestUrl,
                headers: {
                    "Authorization": "key=" + pushConfig.apiKey,
                    "Content-Type": "application/json"
                },
                body: requestBody,
                json: true
            }, function (err, response, body) {
                if (err) {
                    //res.json(err);
                    //nextcb(err);
                    console.log(err);
                } else {
                    console.log(body);
                }
            });
        } else if(device_ios.length > 0){
            
            pushConfig = config.push.IONIC;
            var badge = 0;
            
            device_ios.forEach(function(dev_ios, index){
                badge = parseInt(dev_ios.badge) + 1;
                
                request.post({
                    uri: pushConfig.requestUrl,
                    headers: {
                        "Authorization": "Bearer " + pushConfig.apiKey,
                        "Content-Type": "application/json"
                    },
                    body: {
                        //"tokens": "dDu7e0OEA3o:APA91bH37ji3SLngcd5S2sId_f7YBRzGP6BA21STQ5FF93DKRwv_gY6W-piNIcQ1eno5xJPzRbFR6R36dJd1wVpmhud-44Ax3Cm9gYlrWG81NO2bUMBBUtcxuS4VKv3ZEP7agbxBdLRM",
                        "tokens": [dev_ios.token],
                        "profile": pushConfig.profileName,
                        "notification": {
                            "message": notify.content,
                            "ios": {
                                "title": notify.title,
                                "badge": badge,
                                "sound": "brass.caf"
                            }
                        }
                    },
                    json: true
                }, function (err, response, body) {
                    if (err) {
                        //res.json(err);
                        //nextcb(err);
                        console.log(err);
                    } else {
                        
                        var query = {deviceToken: dev_ios.token},
                            fields = {currentBadgeCount: badge},
                            options = {upsert: false};

                        User.update(query, fields, options, function(err, affected){
                            if (err) {
                                console.log("User.update", err);
                                //callback({success: false, message: "some error occurred", err: err});
                            } else {
                                console.log("User badge updated");
                                //callback({success: true, message: "phone number verified successfully"});
                            }
                        });
                        //console.log("response", JSON.stringify(response));
                        //console.log("body", JSON.stringify(body));
                    }
                });
                
                
            });
            
            
            
            //iOS Push will be here
            /*var apn = require('apn');

            //var tokens = ["<insert token here>", "<insert token here>"];

            var service = new apn.Provider({
                cert: "certificates/cert.pem",
                key: "certificates/key.pem",
            });

            var note = new apn.Notification({
                alert:  "Breaking News: I just sent my first Push Notification",
            });

            // The topic is usually the bundle identifier of your application.
            note.topic = "<bundle identifier>";

            console.log('Sending: ${note.compile()} to ${tokens}');

            var tokens = device_ios;

            service.send(note, tokens).then( function(result) {
                console.log("sent:", result.sent.length);
                console.log("failed:", result.failed.length);
                console.log(result.failed);
            });

            // For one-shot notification tasks you may wish to shutdown the connection
            // after everything is sent, but only call shutdown if you need your 
            // application to terminate.
            //service.shutdown();
        } */        
    }
   
    
}

var UserController = {
    /**
     * Registering a new user
    */

    updateProfileInformations:function (formdata,userData, callback) {
      console.log("userData : ", userData);


        if(typeof (formdata.name) == "undefined" || formdata.name == ""){
            callback({ success: false, statusCode: config.status.BAD_REQUEST, message: "SERVER.USER_NAME_REQUIRED" });
        }else {
            console.log(userData.id);
            UserModel.findOne({ _id: userData.id })
            .select('name username')
            .exec(function(err, user){ 
                if(err){
                  callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: err });  
              }else {
                    var conditions = { _id: userData.id },
                    fields = { name: formdata.name },
                    options = { upsert: false };
                    UserModel.update(conditions, fields, options, function (err, affected) {
                    if (err) {
                       callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: err });
                    } else {
                        callback({ success: true, statusCode: config.status.OK, message: "SERVER.USER_UPDATED" });
                    }
                    });
                }
            });
            
        }  



    },


    DoResetPassword:function (formdata, callback) {
      console.log("formdata : ", formdata);


        if(typeof (formdata.token) == "undefined" || formdata.token == "" || typeof (formdata.new_password) == "undefined" || formdata.new_password == ""){
            callback({ success: false, statusCode: config.status.BAD_REQUEST, message: "SERVER.USER_NAME_REQUIRED" });
        }else {
           
            UserModel.findOne({ changepasswordtoken: formdata.token })
            .select('username')
            .exec(function(err, user){ 
                if(err){
                  callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: err });  
              }else {
                  

                    bcrypt.hash(formdata.new_password, null, null, function (e, hash) {
                            if(e){ 
                                callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: e });
                            }
                            else{
                                var new_password = hash;                       
                                var conditions = { changepasswordtoken: formdata.token },
                                fields = { password: new_password },
                                options = { upsert: false };

                                UserModel.update(conditions, fields, options, function (err, affected) {
                                    if (err) {
                                        callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: err });
                                    } else {

                                        var randomString = require('randomstring');
                                        var token = randomString.generate({length: 210, charset: 'alphanumeric'});
                                        var twentyMinutesLater = new Date();
                                        var expiry = new Date(new Date() + 1000 * 60 * 15)         
                                        var conditions = { changepasswordtoken: formdata.token },
                                        fields = { changepasswordtoken: token, changepasswordtokenexpiry:expiry },
                                        options = { upsert: false };
                                        UserModel.update(conditions, fields, options, function (err, affected) {
                                        });



                                        callback({ success: true, statusCode: config.status.OK, message: "SERVER.PASS_UPDATED" });
                                    }
                                });
                            }
                    });

                }
            });
            
        }  



    },

    
    updateUserInformations:function (formdata,userData, callback) {
      console.log("userData : ", userData);


        if(typeof (formdata.name) == "undefined" || formdata.name == ""){
            callback({ success: false, statusCode: config.status.BAD_REQUEST, message: "SERVER.USER_NAME_REQUIRED" });
        }else {
            console.log(formdata._id);
            UserModel.findOne({ _id: formdata.id })
            .select('name username')
            .exec(function(err, user){ 
                if(err){
                  callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: err });  
              }else {
                    var conditions = { _id: formdata.id },
                                fields = { name: formdata.name },
                                options = { upsert: false };

                                UserModel.update(conditions, fields, options, function (err, affected) {
                                    if (err) {
                                        callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: err });
                                    } else {
                                        callback({ success: true, statusCode: config.status.OK, message: "SERVER.USER_UPDATED" });
                                    }
                                });

                }
            });
            
        }  



    },

    AddNewUser: function (userData, callback) {

        console.log("userData >> ",userData.password);
        if(typeof (userData.name) == "undefined" || userData.name == "")
        var name = null;
        else
        var name = userData.name;

        async.waterfall([
            function(nextcb){
                var customErr = {success: null, status: null, message: null};
                

                 bcrypt.hash(userData.password, null, null, function (e, hash) {
                            if(e){ 
                                callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: e });
                            }
                            else{
                                var new_password = hash; 

                                var user = new UserModel({
                                    username: userData.email,
                                    password: new_password,
                                    name: name
                                });
                                
                               
                                user.save(function(err, res) {
                                    if (err) {
                                        customErr = { success: false, statusCode: config.status.BAD_REQUEST, err: err };
                                         nextcb(null, customErr, user);
                                         
                                    } else {

                                        customErr = { success: true, statusCode: config.status.OK, message: "SERVER.REG_SUCCESS" };
                                        nextcb(null, customErr, user);
                                        
                                    }
                                });
                            }
                    });


                
            }
            
        ], function(err, response){
            callback(response);
        })

        

        /**/


    },

    checkResetPasswordToken: function (userData,userAgents, callback) {

      if (typeof (userData.token) == "undefined" || userData.token == "") {
            callback({ success: false, message: "token missing" });
        } else {
            var inputDate = new Date();
            UserModel.findOne({ changepasswordtoken: userData.token,useradmin:true ,'changepasswordtokenexpiry': { $lte: inputDate } })
                .select('username useradmin')
                .exec(function (err, user) {
                    if (err){
                     callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: err });
                    }else {
                        if (!user) {
                            callback({ success: false, statusCode: config.status.NOT_AUTHORIZED, message: "SERVER.USER_NOT_FOUND" });
                        } else{
                             callback({ success: true, statusCode: config.status.OK, message: "SERVER.RESET_ALLOW", id : user.id, name : user.name,email : user.username,useradmin : user.useradmin });
                        }
                    }
                });
        }
    },

    doLogin: function (userData, userAgents, callback) {
        if (typeof (userData.email) == "undefined" || userData.email == "") {
            callback({ success: false, message: "please provide username" });
        } else if (typeof (userData.password) == "undefined" || userData.password == "") {
            callback({ success: false, message: "please provide password" });
        } else {
            UserModel.findOne({ username: userData.email })
                .select('username password name useradmin')
                .exec(function (err, user) {
                    if (err)
                        callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: err });
                    else {
                        //console.log(user);
                        if (!user) {
                            callback({ success: false, statusCode: config.status.NOT_AUTHORIZED, message: "SERVER.USER_NOT_FOUND" });
                        } else if (!user.comparePassword(userData.password)) {
                            callback({ success: false, statusCode: config.status.NOT_AUTHORIZED, message: "SERVER.AUTH_FAILED" });
                        } else {

                            var UAParser = require('ua-parser-js');
                            var parser = new UAParser();
                            //console.log(ua_str);
                            //var ua = req.headers['user-agent'];     // user-agent header from an HTTP request
                            var uaObj = parser.setUA(userAgents);
                            //console.log(uaObj);
                            //console.log(uaObj.getOS());
                            var user_agent = uaObj.getResult();
                            //console.log(typeof(user_agent));*/

                            var device_token = null;
                            var latitude = null;
                            var longitude =  null;
                            if(typeof(userData.deviceToken) != 'undefined'){
                                device_token = userData.deviceToken;
                                UserModel.find({deviceToken: device_token})
                                        .exec(function(err, userdetails){
                                            if(userdetails){
                                                for (var i = 0, len = userdetails.length; i < len; i++) {
                                                 var conditions = { _id: userdetails[i]._id },
                                                        fields = { deviceToken: null },
                                                        options = { upsert: false };

                                                        UserModel.update(conditions, fields, options);
                                                }
                                            }else{
                                                //
                                            }
                                        });
                            }
                            if(typeof(userData.current_lat) != 'undefined'){
                                latitude = userData.current_lat;
                            }
                            if(typeof(userData.current_long) != 'undefined'){
                                longitude = userData.current_long;
                            }

                            //========= Updating user record ===========//
                            var conditions = { _id: user._id },
                                fields = { current_lat: latitude, current_long: longitude, isLoggedIn: true, lastLogin: Date.now(), deviceToken: device_token, userAgent: user_agent },
                                options = { upsert: false };

                            UserModel.update(conditions, fields, options, function (err, affected) {
                                if (err) {
                                    callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: err });
                                } else {
                                    var token = createToken(user);
                                    //console.log(user);
                                    callback({ success: true, statusCode: config.status.OK, message: "SERVER.LOGIN_SUCCESS", token: token , id : user.id, name : user.name,email : user.username,useradmin : user.useradmin });
                                }
                            });

                        }
                    }
                });
        }
    },

    getMyDetails: function(userData, callback){
        UserModel.findOne({_id: userData.id})
                .select('name username lastLogin profileImage createdAt')
                .lean()
                .exec(function(err, user){
                    if(err)
                        callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: err });
                    else {
                        
                        /*if(user.profileImage !== null && user.profileImage !== "")
                            user.profileImage = config.IMAGE_BASE_DIR + 'profile/' + user.profileImage;
                        else */
						user.profileImage = "";

                        callback({ success: true, statusCode: config.status.OK, message: "", me: user });                        
                    }
                })
    },

    getUserInfo: function(userData, callback){
        console.log(userData);

        UserModel.findOne({_id: userData.params.id})
                .select('name username lastLogin profileImage createdAt')
                .lean()
                .exec(function(err, user){
                    if(err)
                        callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: err });
                    else {
                        
                        /*if(user.profileImage !== null && user.profileImage !== "")
                            user.profileImage = config.IMAGE_BASE_DIR + 'profile/' + user.profileImage;
                        else */
                        user.profileImage = "";

                        callback({ success: true, statusCode: config.status.OK, message: "", me: user });                        
                    }
                })
    },

    deleteUser: function(userData, callback){
      

         UserModel.findOne({_id: userData.params.id})
        .exec(function(err, userdetails){
            if(userdetails){
                userdetails.remove(function(err){
                    if(err){
                        callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "some internal error has occurred", err: err });
                    } else {
                        callback({ success: true, statusCode: config.status.OK, message: "User removed" });
                    }
                })
            } else {
                callback({ success: false, statusCode: config.status.NOT_FOUND, message: "Please try again" });
            }
         });

      
    },

    getAlluser: function(user, callback){
        UserModel.find({})
                .select('name username lastLogin isLoggedIn profileImage createdAt updatedAt')
                .exec(function(err, user){
                    if(err)
                        callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: err });
                    else {
                        
                        callback({ success: true, statusCode: config.status.OK, message: "", users: user });                        
                    }
                })
    },

    changeMyPassword: function(passwordInfo, userData, callback){
        
         if(typeof(passwordInfo) == "undefined" || typeof(passwordInfo.old_password) == "undefined" || passwordInfo.old_password == ""){
            callback({ success: false, statusCode: config.status.BAD_REQUEST, message: "SERVER.OLD_PASS_BLANK" });
        } if(typeof(passwordInfo) == "undefined" || typeof(passwordInfo.new_password) == "undefined" || passwordInfo.new_password == ""){
            callback({ success: false, statusCode: config.status.BAD_REQUEST, message: "SERVER.NEW_PASS_BLANK" });
        } else {
            console.log(userData.id);
            UserModel.findOne({ _id: userData.id })
            .select('name username password')
            .exec(function(err, user){ 
                if(err)
                    callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: err });
                else {
                    if(!user.comparePassword(passwordInfo.old_password)){                        
                        callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.OLD_PASS_INVALID", err: err });
                    }else{
                        bcrypt.hash(passwordInfo.new_password, null, null, function (e, hash) {
                            if(e){ 
                                callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: e });
                            }
                            else{
                                var new_password = hash;                       
                                var conditions = { _id: userData.id },
                                fields = { password: new_password },
                                options = { upsert: false };

                                UserModel.update(conditions, fields, options, function (err, affected) {
                                    if (err) {
                                        callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: err });
                                    } else {
                                        callback({ success: true, statusCode: config.status.OK, message: "SERVER.PASS_UPDATED" });
                                    }
                                });
                            }
                        });

                    }
                    
                    

                }
            });
            
        }  
    },

    forgotMyPassword: function(req_data , callback){

       if ((typeof (req_data.email) == 'undefined') || (req_data.email == "")) {
            callback({success: false, message: "Please provide email id"});
        } else { 
            UserModel.findOne({username: req_data.email,useradmin:true})
            .select('name username')
            .exec(function(err, user){ 
                if(err){
                 callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: err });
                }else {
                    if(!user){                        
                        callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.OLD_PASS_INVALID", err: err });
                    }else{
                        var randomString = require('randomstring');
                        var token = randomString.generate({length: 210, charset: 'alphanumeric'});
                        var twentyMinutesLater = new Date();

                        var expiry = new Date(new Date() + 1000 * 60 * 15)
                                      
                        var conditions = { _id: user._id },
                        fields = { changepasswordtoken: token, changepasswordtokenexpiry:expiry },
                        options = { upsert: false };
                        UserModel.update(conditions, fields, options, function (err, affected) {
                                    if (err) {
                                        callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: err });
                                    } else {

                                         /*------------------ Send mail -------------------------*/

                                            var otp = randomstring.generate(7);
                                            var transporter = nodemailer.createTransport(smtpTransport({
                                                pool: true,
                                                //host: 'ssl://s132-148-81-223.secureserver.net ',
                                                host: 's132-148-81-223.secureserver.net',
                                                port: 465,
                                                secure: true, // use TLS
                                                auth: {
                                                    user: 'support@protegeteapp.com',
                                                    pass: "sUpport4Protegete"
                                                }
                                            }));
                                            
                                            // setup email data with unicode symbols
                                            var mailOptions = {
                                                from: '"Protegete" <support@protegeteapp.com>', // sender address
                                                to: req_data.email, // list of receivers
                                                subject: 'Password Recovery for Protegete App', // Subject line
                                                //html: 'Hello User, <br> Your One Time Password is following.<br> OTP: '+otp+'<br>Please use this to login', // plain text body
                                                text: 'Hi Protegete User, \n\n Your Password reset link - '+config.SITE_BASE_URL+'/#/resetpassword/'+token // html body
                                            };

                                            // send mail with defined transport object
                                            transporter.sendMail(mailOptions, (error, info) => {
                                                if (error) {
                                                    return console.log(error);
                                                    
                                                } else{
                                                    return console.log('Message %s sent: %s', info.messageId, info.response);
                                                    
                                                }
                                                
                                            });

                                            callback({ success: true, statusCode: config.status.OK, message: "Email sent to your mail id." });

                                           /* --------------------------- Send Email -----------------------------*/
                                       
                                    }
                        });
                            
                      

                    }
                    
                    

                }
            });


           
        }    

           
     





//         if(typeof(emailInfo) == "undefined" || typeof(emailInfo.email) == "undefined" || emailInfo.email == ""){
//             callback({ success: false, statusCode: config.status.BAD_REQUEST, message: "Email field can't be blank" });
//         } else {
//             console.log(emailInfo);

//             /*
//         //start sent mail
//         // create reusable transporter object using the default SMTP transport 
//         var transporter = nodemailer.createTransport('smtps://amlan.brainium@gmail.com:brainium.amlan@smtp.gmail.com');
//         // setup e-mail data with unicode symbols 
//         var mailOptions = {
//             from: '"Fred Foo" <foo@blurdybloop.com>', // sender address 
//             to: emailInfo.email, // list of receivers 
//             subject: 'Hello', // Subject line 
//             //text: 'Hello world', // plaintext body 
//             html: '<b>Hello world</b>' // html body 
//         };
//         // send mail with defined transport object 
//         transporter.sendMail(mailOptions, function(error, info)
//         {
//             if (error)
//             {
//                 console.log('Message not sent: ' + error);
//                 res.json(error);
//             }
//             else
//             {
//                 console.log('Message sent: ' + info.response);
//                 res.json(info.response);
//             }
//         });
//         //end of sent mail 



// */


//             var otp = randomstring.generate(7);

//             //////////////////////////////////////////////////
//             // create reusable transporter object using the default SMTP transport
//             var transporter = nodemailer.createTransport(smtpTransport({
//                 service: 'gmail',
//                 auth: {
//                     user: 'soumya.amstech@gmail.com',
//                     pass: 'bootupsmarya'
//                 }
//             }));

//             // setup email data with unicode symbols
//             var mailOptions = {
//                 from: '"Soumya Bhattacharya" <soumya.amstech@gmail.com>', // sender address
//                 to: 'soumya.brainium@gmail.com', // list of receivers
//                 subject: 'Password Recovery for Protegete App', // Subject line
//                 //html: 'Hello User, <br> Your One Time Password is following.<br> OTP: '+otp+'<br>Please use this to login', // plain text body
//                 text: '<b>Hello world ?</b>' // html body
//             };

//             // send mail with defined transport object
//             transporter.sendMail(mailOptions, (error, info) => {
//                 if (error) {
//                     return console.log(error);
//                     callback({ success: false, statusCode: config.status.BAD_REQUEST, message: "Email not sent." });
//                 } else{
//                     return console.log('Message %s sent: %s', info.messageId, info.response);
//                     callback({ success: true, statusCode: config.status.OK, message: "Email sent to your mail id." });
//                 }
                
//             });

          



//         }

    },

     alert: function(alertInfo, userData, callback){
        if(typeof(alertInfo) == "undefined" || typeof(alertInfo.latitude) == "undefined" || alertInfo.latitude == ""){
            callback({ success: false, statusCode: config.status.BAD_REQUEST, message: "Latitude can't be blank" });
        } else if(typeof(alertInfo) == "undefined" || typeof(alertInfo.longitude) == "undefined" || alertInfo.longitude == ""){
            callback({ success: false, statusCode: config.status.BAD_REQUEST, message: "Longitude can't be blank" });
        } else if(typeof(alertInfo) == "undefined" || typeof(alertInfo.type) == "undefined" || alertInfo.type == ""){
            callback({ success: false, statusCode: config.status.BAD_REQUEST, message: "Alert type can't be blank" });
        } else{
            var today = new Date().toISOString().replace(/T/, ' ');            
            var todayDate = dateFormat(today, 'shortDate');
            AlertModel.findOne({type: alertInfo.type, latitude: alertInfo.latitude, longitude: alertInfo.longitude, _user: userData.id},
                    function(er, alerts){                       
                        if(alerts && dateFormat(alerts.createdAt, 'shortDate') == todayDate){
                            //var lastalertDate = dateFormat(alerts.createdAt, 'shortDate');
                            //if(lastalertDate == todayDate)
                                callback({ success: false, statusCode: config.status.CONFLICT, message: "SERVER.ALERT_EXIST", err: er });
                            
                        } else {
                            var alert = new AlertModel({
                                type: alertInfo.type,
                                latitude: alertInfo.latitude,
                                longitude: alertInfo.longitude,
                                postbyadmin: true,
                                _user: userData.id
                            });

                            alert.save(function(err, alertdata){
                                if(err)
                                    callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: err });
                                else{
                                    console.log(alertdata);
                                    var userlat = alertInfo.latitude;
                                    var userlong = alertInfo.longitude;
                                    UserModel.find({}, function(er, users){
                                        if(er)
                                            callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "No more users", err: er });
                                        else{
                                            var allUsers = {};
                                            var deviceDetails = [];
                                            for (var i = 0, len = users.length; i < len; i++) {
                                                if(users[i].deviceToken && users[i].deviceToken != null && users[i].current_lat && users[i].current_lat != null && users[i].current_long &&  users[i].current_long != null ){
                                                    var otherlat = users[i].current_lat;
                                                    var otherlong = users[i].current_long;

                                                    var locationdist = geolib.getDistance(
                                                    {latitude: otherlat, longitude: otherlong},
                                                    {latitude: userlat, longitude: userlong}
                                                    );
                                                    
                                                    var distance = geolib.convertUnit('mi', locationdist, 2);
                                                    console.log(distance);
                                                     if(distance < 101){
                                                        deviceDetails.push({deviceToken: users[i].deviceToken, deviceType: users[i].userAgent.os.name});                                                        
                                                    }
                                                }else{
                                                   //
                                                }
                                                                                               
                                            }

                                             console.log("---------------- deviceDetails -------------------");
                                             console.log(deviceDetails);


                                            if(deviceDetails.length > 0){
                                                allUsers.deviceDetails = deviceDetails;
                                                allUsers.title = "Protegete";
                                                allUsers.latitude = userlat;
                                                allUsers.longitude = userlong;
                                                allUsers.type = alertInfo.type;
                                                if(alertInfo.type=='alert')
                                                    var settingtype="PushMessageEmergency";    
                                                else
                                                    var settingtype="PushMessageWarning";       
                                                    
                                                allUsers.message = "New "+(alertInfo.type=='alert' ? 'emergency' : 'warning') + " reported in your area";
                                                SettingsModel.findOne({settingtype:settingtype})
                                                    .select('settingtype value language_english language_spanish')
                                                    .lean()
                                                    .exec(function(err, setting){
                                                        if(err)
                                                            callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: err });
                                                        else {
                                                           
                                                            allUsers.message = setting.language_spanish;
                                                            console.log("-----------------------------------");
                                                            console.log("allUsers", allUsers);
                                                            sendPushNotification(allUsers);  
                                                                          
                                                        }
                                                    })

                                            }
                                            callback({ success: true, message: "SERVER." + ((alertInfo.type == "alert") ? "ALERT" : "WARNING") + "_POSTED", nearMyLocation: allUsers });
                                           
                                            
                                            
                                        }
                                    })
                                    
                                }
                                    
                            })
                        }
                    }).sort({createdAt: -1}).limit(1);             
            
        }
    },

    getAllAlert: function(latlongInfo, userData, callback){

        var alertdata = [];
                AlertModel.find({postbyadmin:true}, function(er, alert){
                    if(er)
                        callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: err });
                    else{
                        
                        for(var i=0; i<alert.length; i++){
                            
                            if(alert[i].type=="alert")  {
                             var part_arr = {
                                postbyadmin:true,
                                lat: alert[i].latitude,
                                lng: alert[i].longitude,
                                icon: 'http://132.148.81.223:3037/images/markers/red-dot.png',                                 
                            };
                            }else{
                             var part_arr = {
                                postbyadmin:true,
                                lat: alert[i].latitude,
                                lng: alert[i].longitude,
                                icon: 'http://132.148.81.223:3037/images/markers/green-dot.png',                                 
                            };
                            }
 
                            alertdata.push(part_arr);
                        }
                        callback({ success: true, message: "", alerts: alertdata });
                    }
                })

             
      

    },

     getSettingData: function(settingtype, callback){

        SettingsModel.findOne({settingtype:settingtype})
                .select('settingtype value language_english language_spanish')
                .lean()
                .exec(function(err, setting){
                    if(err)
                        callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: err });
                    else {
                       
                       
                        callback({ success: true, statusCode: config.status.OK, message: "", setting: setting });                        
                    }
                })
    },

    updateSetting: function(Data, callback){
        SettingsModel.findOne({settingtype:  Data.settingtype})
                .select('Setting type  value language_english language_spanish')
                .lean()
                .exec(function(err, setting){
                    if(err)
                        callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: err });
                    else {

                        if(setting==null){

                           var setting = new SettingsModel({
                                settingtype: Data.settingtype,
                                value: '',
                                language_english: Data.language_english,
                                language_spanish: Data.language_spanish
                            });

                            setting.save(function(err, settingdata){
                                if(err)
                                    callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: err });
                                else{
                                    callback({ success: true, statusCode: config.status.OK, message: "Insert successfully" });       
                                }
                            });

                                           
                        }else{

                                 var conditions = { _id: setting._id },
                                fields = { settingtype: Data.settingtype ,  language_english: Data.language_english, language_spanish: Data.language_spanish},
                                options = { upsert: false };

                                SettingsModel.update(conditions, fields, options, function (err, affected) {
                                    if (err) {
                                        callback({ success: false, statusCode: config.status.SERVER_ERROR, message: "SERVER.INTERNAL_ERROR", err: err });
                                    } else {
                                        callback({ success: true, statusCode: config.status.OK, message: "Update successfully" });
                                    }
                                });

                  
                        }
                       
                       
                       
                    }
                })
    },

}

module.exports = UserController;


