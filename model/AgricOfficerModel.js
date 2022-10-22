const mongoose = require('mongoose');

const agricOfficerSchema = new mongoose.Schema({
    name: String,
    ward: String,
    status: String,
    gender: String,
    dob: {
        type: Date,
        default: () => Date.now()
    },
    nin: String,
    phone: String,
    residence: String,
    periodOfStay: String,
    idToLogin: String
})

module.exports = mongoose.model('RegisteredFarmerOnes', agricOfficerSchema)