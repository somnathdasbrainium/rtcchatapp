/*
 * User Model
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var beautifyUnique = require('mongoose-beautiful-unique-validation');

// var validateEmail = function(email) {
//     var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     return re.test(email)
// };


var Schema = mongoose.Schema;
var SettingsSchema = new Schema({
        settingtype: { 
                type: String, 
                required: [true, 'Setting type is required'], 
        },
        value: { 
                type: String, 
        },
        language_english: { 
                type: String,  
        },
        language_spanish: { 
                type: String,  
        }
       
        
}, {
        timestamps: true
});



module.exports = mongoose.model('Settings', SettingsSchema);