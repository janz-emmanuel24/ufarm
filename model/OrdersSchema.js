const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    order_status: {
        type: String,
        default: 'booked & pending'
    },
    produce_ordered: {
        type: String
    },
    ordered_date: {
        type: Date,
        default: () => Date.now()
    },
    order_quantity: {
        type: Number
    },
    unit_price: {
        type: Number
    }, 
    total_price: {
        type: Number
    },
    produce_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Urban_Farmer_Uploads'
    },
    produce_owner_name: {
        type: String
    },
    produce_owner_contact: {
        type: String
    },
    produce_owner_ward: {
        type: String
    },
    produce_owner_email: {
        type: String
    },
    booked_by: {
        type: mongoose.Types.ObjectId,
        ref: 'PublicUser'
    },
    public_user_email: {
        type: String
    },
    public_user_name: {
        type: String
    },
    public_user_contact: {
        type: String
    }
})

module.exports = mongoose.model('Order', orderSchema)