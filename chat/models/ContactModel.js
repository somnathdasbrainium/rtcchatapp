/*
 * Contact Model
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ContactSchema = new Schema({
        name: { 
                type: String, 
                required: [true, 'please provide name'],
                minlength: [3, 'SERVER.NAME_MIN']
        },
        phone_no: { 
                type: String, 
                required: [true, 'SERVER.PROVIDE_PHONE']
        },
        _user: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'User'
                /// <reference path="" />
        },
        text: { 
                type: String       
        },
}, {
        timestamps: true
});

module.exports = mongoose.model('Contact', ContactSchema);