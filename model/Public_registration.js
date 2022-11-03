const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const publicRegSchema = new mongoose.Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    dob: {
        type: Date
    },
    gender: {
        type: String
    },
    username: {
        type: String
    },
    phoneNumber: {
        type: String
    }
})

publicRegSchema.plugin(passportLocalMongoose,{
    usernameField: 'username'
})

module.exports = mongoose.model('PublicUser', publicRegSchema)
