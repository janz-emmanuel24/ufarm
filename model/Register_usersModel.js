const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')

const registerUsers_schema = new mongoose.Schema({
    fullname: {
        type: String,
        require: true
    },
    ward: {
        type: String
    },
    status_appointed: {
        type: String
    },
    gender: {
        type: String
    },
    dob: {
        type: Date,
        default: () => Date.now()
    },
    dor: {
        type: Date,
        default: () => Date.now()
    },
    nin: {
        type: String
    },
    phone: {
        type: String
    },
    role: {
        type: String
    },
    residence: {
        type: String
    },
    directionsToPlace: {
        type: String
    },
    periodOfStay: {
        type: Number
    },
    activities: [{
        type: String
    }],// in the checkbox have same name but different values
    loginId: {
        type: String,
        required: true
    }
})

registerUsers_schema.plugin(passportLocalMongoose, {
    usernameField: 'loginId'
})

module.exports = mongoose.model('Registered_users', registerUsers_schema)