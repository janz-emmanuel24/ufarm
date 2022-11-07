const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const publicRegSchema = new mongoose.Schema({
   google: {
    id: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String
    }
   }
})

module.exports = mongoose.model('PublicUser', publicRegSchema)
