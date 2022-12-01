const mongoose = require('mongoose')

const produce_Schema = new mongoose.Schema({
    pname: {
        type: String,
        lowercase: true
    },
    pward: {
        type: String,
    },
    produce_owner: {
        type: mongoose.Types.ObjectId,
        ref: "Registered_users"
    },
    sales_description: {
        type: String,
    },
    upload_date: {
        type: Date,
        default: () => Date.now()
    },
    unit_price: {
        type: Number,
    },
    quantity: {
        type: Number
    },
    mode_of_payment: {
        type: String
    },
    produce_type: {
        type: String,
        lowercase: true
    }, 
    produce_availability: {
        type: String,
        default: 'available'
    },
    fullname: {
        type: String
    },
    contact: {
        type: String
    },
    product_status: {
        type: String,
        default: 'pending'
    },
    produce_image: {
        type: String
    }
})

module.exports = mongoose.model('Urban_Farmer_Uploads', produce_Schema)

