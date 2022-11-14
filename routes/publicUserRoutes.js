const express = require('express')
const router = express.Router()
const passport = require('passport')
const connectEnsureLogin = require('connect-ensure-login')

const Produce_upload_model = require('../model/Produce_upload_model');
const RegisterPublicUsersModel = require('../model/Public_registration')
const OrderSchemaModel = require('../model/OrdersSchema')
const Public_User = require('../model/Public_registration')

/** OPEN PUBLIC ROUTES */

router.get('/', (req, res) => {

    logged_in_public_user = req.user;

    console.log(logged_in_public_user)

    res.render('landingpage', {logged_in_public_user})
})

router.get('/our_farmers', (req,res) => {
    res.render('ourfarmers')
})

router.get('/categories_in_shop', async (req, res) => {
    const all_approved_produces = await Produce_upload_model.aggregate([{$match: {product_status: "approved"}}])
    console.log(all_approved_produces)


    res.render('categories', {all_approved_produces})
})

router.get('/horticulture', async (req, res) => {
    const all_horticulture_produces = await Produce_upload_model.aggregate([{$match: {produce_type: "horticulture"}}])
    
    res.render('horticulture', {all_horticulture_produces})
})

router.get('/dairy', async (req, res) => {
    const all_dairy_produces = await Produce_upload_model.aggregate([{$match: {produce_type: "dairy"}}])

    console.log('These are diary products', all_dairy_produces)

    res.render('dairy', {all_dairy_produces})
})

router.get('/poultry', async (req, res) => {
    const all_poultry_produces = await Produce_upload_model.aggregate([{$match: {produce_type: "poultry"}}])

    console.log('These are poultry products', all_poultry_produces)
    
    res.render('poultry', {all_poultry_produces})
})


/** CLOSED PUBLIC ROUTES */

router.get('/categories_check', connectEnsureLogin.ensureLoggedIn('/user_login'), async (req,res) => {

    let all_produces;

    let searchQuery;

    if(req.query.search_produce) {
        //store the query string and convert it to lowercase
        searchQuery = req.query.search_produce.toLocaleLowerCase();

        //query the DB with the search Query
        all_produces = await Produce_upload_model.find({produce_type: searchQuery})
    } else {
        all_produces = await Produce_upload_model.find();
    }

    console.log('This is the searched word', searchQuery)
    console.log('This is the returned results with the query String', all_produces)

    res.render('market', {all_produces}) 
})

router.get('/my_orders', connectEnsureLogin.ensureLoggedIn('/user_login'), async (req, res) => {

    //get the user's orders
    // const myOrders = await OrderSchemaModel.find();

    const logged_in_public_user = req.user;

    console.log('This is the logged in user', logged_in_public_user)

    const myOrders = await OrderSchemaModel.aggregate([
        {$match: {$or: [{order_status: 'booked & pending'},{order_status: 'Approved for Delivery'}]}},
        {$group: {
            _id: {
                _id: '$_id', 
                order_status: '$order_status', 
                produce_owner_name: '$produce_owner_name',
                produce_ordered: '$produce_ordered',
                order_quantity: '$order_quantity',
                unit_price: '$unit_price',
                produce_owner_email: '$produce_owner_email',
                produce_owner_contact: '$produce_owner_contact',
                public_user_name: '$public_user_name'
            }, 
            productTotal: {
                $sum: {
                    $multiply: ["$order_quantity", "$unit_price"]
                }
            }
        }}
    ])

    console.log('These are my orders with totals', myOrders)

    console.log('This is the first item in the ordersWithTotals', myOrders[1]._id.produce_owner_name, 'And this is the total ', myOrders[1].productTotal);

    res.render('my_bookings', {myOrders, logged_in_public_user})
})

router.post('/create_booking', connectEnsureLogin.ensureLoggedIn('/user_login'), async (req, res) => {
    req.session.user = req.user

    //get the order schema
    const order = new OrderSchemaModel(req.body)

    //get the ordered produce by its ID from the uploaded produce schema
    const bookedProduct = await Produce_upload_model.findOne({_id: req.body.produce_id})
    // console.log('This is the bookedPrduct', bookedProduct)
    order.produce_ordered = bookedProduct.pname
    order.unit_price = bookedProduct.unit_price
    order.produce_owner_ward = bookedProduct.pward
    order.produce_owner_email = bookedProduct.farmer_email

    //get the user making the order's id
    const public_user_info = await Public_User.findOne({_id: req.session.user._id})

    //change a few fields in the order schema based on the results of the previous queries
    order.public_user_email = public_user_info.google.email
    order.public_user_name = public_user_info.google.name
    order.booked_by = public_user_info._id

    //save the order schema
    console.log('This is the order Schema', order)
    
    //save the order to DB
    // await order.save()

    //redirect the user to the mybookings page so that he can see his orders and general information

    res.redirect('/my_orders')

    // console.log('This is the user information', req.session.user)

    // console.log(req.body);
})



module.exports = router;
