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
    res.render('landingpage')
})

router.get('/our_farmers', (req,res) => {
    res.render('ourfarmers')
})

router.get('/categories_in_shop', async (req, res) => {
    res.render('categories')
})

router.get('/horticulture', async (req, res) => {
    const all_horticulture_produces = await Produce_upload_model.aggregate([{$match: {produce_type: "horticulture"}}])
    res.render('horticulture')
})

router.get('/dairy', async (req, res) => {
    const all_dairy_produces = await Produce_upload_model.aggregate([{$match: {produce_type: "dairy"}}])
    res.render('dairy')
})

router.get('/poultry', (req, res) => {
    res.render('poultry')
})

router.get('/vegetables', async (req, res) => {
    const all_approved_produces = await Produce_upload_model.aggregate([{$match: {produce_type: "horticulture"}}])

    res.render('vegetables', {all_approved_produces})
})

router.get('/fruits', async (req, res) => {
    const all_fruits_produces = await Produce_upload_model.aggregate([{$match: {produce_type: "horticulture"}}])

    res.render('fruits', {})
})


/** CLOSED PUBLIC ROUTES */

router.get('/categories_check', connectEnsureLogin.ensureLoggedIn('/user_login'), async (req,res) => {

    const all_produces = await Produce_upload_model.find();


    res.render('market', {all_produces})
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

    //some aggregation is done to change the total price depending on the quantity ordered

    //get the user making the order's id
    const public_user_info = await Public_User.findOne({_id: req.session.user._id})

    //change a few fields in the order schema based on the results of the previous queries
    order.public_user_email = public_user_info.google.email
    order.public_user_name = public_user_info.google.name
    order.booked_by = public_user_info._id

    //save the order schema
    console.log('This is the order Schema', order)


    //redirect the user to the mybookings page so that he can see his orders and general information

    console.log('This is the user information', req.session.user)

    console.log(req.body);
})



module.exports = router;
