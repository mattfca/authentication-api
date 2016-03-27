var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
    email: { type: [String], index: { unique: true, dropDups: true }, lowercase: true, required: true },
    password: {type: String, required:true},
    admin: { type: Boolean, default: false },
    updated: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now }
}, { autoIndex: false }));
