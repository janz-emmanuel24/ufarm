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

    const logged_in_user = req.user;
    const loggedInFarmerOne = req.session.user;

    console.log('This is th logged in farmer one',loggedInFarmerOne);

    const urbanfarmers = await Register_usersModel.find({role: "urban farmer"});
    const urban_farmers_uploads = await Produce_upload_model.find();
    const produce_images = await Produce_upload_model.find();


    //Aggregations to get the total produces for different categories

    //get the orders made for farmers in this farmer's ward
    const user_orders_for_farmerOne_ward = await User_orders.find()

    // console.log('These orders are for farmer one ward',user_orders_for_farmerOne_ward)

    //Aggregations to get the farmerOnes total of products
    //we shall have a loop that compares the farmerOne ward to the total of the products got from aggregations - comparing the logged in farmerOne ward to the ward of the produces

    //Total of horticulture produces based on ward
    const horticulture_totals_based_on_ward = await Produce_upload_model.aggregate([
        {$match: {produce_type: 'horticulture'}},
        {$group: {
            _id: {
                _id: '$pward'
            }, 
            totalQuantity: {
                $sum: '$quantity'
            }, 
            total_horticulture: {
                $sum: {
                    $multiply: ['$unit_price', '$quantity']
                }
            }
        }}
    ])

    const poultry_totals_based_on_ward = await Produce_upload_model.aggregate([
        {$match: {produce_type: 'poultry'}},
        {$group: {
            _id: {
                _id: '$pward'
            }, 
            totalQuantity: {
                $sum: '$quantity'
            }, 
            total_poultry: {
                $sum: {
                    $multiply: ['$unit_price', '$quantity']
                }
            }
        }}
    ])

    const diary_totals_based_on_ward = await Produce_upload_model.aggregate([
        {$match: {produce_type: 'dairy'}},
        {$group: {
            _id: {
                _id: '$pward'
            }, 
            totalQuantity: {
                $sum: '$quantity'
            }, 
            total_diary: {
                $sum: {
                    $multiply: ['$unit_price', '$quantity']
                }
            }
        }}
    ])

    // console.log('Total horticulture produces based on ward', horticulture_totals_based_on_ward)
    // console.log('Total poultry produces based on ward', poultry_totals_based_on_ward)
    // console.log('Total diary produces based on ward', diary_totals_based_on_ward)

    

    res.render('farmer_one_dashboard', {
        urbanfarmers, 
        urban_farmers_uploads, 
        loggedInFarmerOne, 
        user_orders_for_farmerOne_ward, 
        horticulture_totals_based_on_ward, 
        poultry_totals_based_on_ward, 
        diary_totals_based_on_ward,
        logged_in_user,
        produce_images
    })
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
