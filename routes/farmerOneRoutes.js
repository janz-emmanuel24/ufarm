const express = require('express')
const router = express.Router()
const connectEnsureLogin = require('connect-ensure-login')

//Imports
const Register_usersModel = require('../model/Register_usersModel');
const Produce_upload_model = require('../model/Produce_upload_model')
const User_orders = require('../model/OrdersSchema')

router.get('/', connectEnsureLogin.ensureLoggedIn('/login'), async (req, res) => {
    //get the farmer One Session Details
    req.session.user = req.user;

    const loggedInFarmerOne = req.session.user;

    console.log('This is th logged in farmer one',loggedInFarmerOne);

    const urbanfarmers = await Register_usersModel.find({role: "urban farmer"});
    const urban_farmers_uploads = await Produce_upload_model.find();

    //Aggregations to get the total produces for different categories

    //get the orders made for farmers in this farmer's ward
    const user_orders_for_farmerOne_ward = await User_orders.find()

    console.log('These orders are for farmer one ward',user_orders_for_farmerOne_ward)

    

    res.render('farmer_one_dashboard', {urbanfarmers, urban_farmers_uploads, loggedInFarmerOne, user_orders_for_farmerOne_ward})
})

router.post('/approve_decline/:productId', async (req, res) => {
    const productId = req.params.productId;
    const produce_to_approve = await Produce_upload_model.findById(productId);
    produce_to_approve.product_status = req.body.approve_decline;

    // console.log(produce_to_approve.product_status)
    try {
        await produce_to_approve.save()
        res.redirect('/farmer_one_dashboard')
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;
