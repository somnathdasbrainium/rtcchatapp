/*
 * Contact Model
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AlertSchema = new Schema({
        type: { 
                type: String, 
                required: [true, 'please provide alert type']               
        },
        postbyadmin: { 
                type: Boolean, 
                default: false              
        },
        latitude: { 
                type: String, 
                required: [true, 'please provide latitude']
        },
        longitude: { 
                type: String, 
                required: [true, 'please provide longitude']
        },
        _user: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'User'
                /// <reference path="" />
        }
}, {
        timestamps: true
});

module.exports = mongoose.model('Alert', AlertSchema);