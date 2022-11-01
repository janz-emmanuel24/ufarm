const express = require('express')
const router = express.Router()
const connectEnsureLogin = require('connect-ensure-login')

//Imports
const Register_usersModel = require('../model/Register_usersModel');
const Produce_upload_model = require('../model/Produce_upload_model')

router.get('/', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    //get the farmer One Session Details
    req.session.user = req.user;

    const loggedInFarmerOne = req.session.user;

    console.log(loggedInFarmerOne);

    const urbanfarmers = await Register_usersModel.find({role: "urban farmer"});
    const urban_farmers_uploads = await Produce_upload_model.find();

    res.render('farmer_one_dashboard', {urbanfarmers, urban_farmers_uploads, loggedInFarmerOne})
})

router.post('/register_urban_farmer', connectEnsureLogin.ensureLoggedIn(), async (req,res) => {
    const registerUrbanFarmers = new Register_usersModel(req.body);
    await Register_usersModel.register(registerUrbanFarmers, req.body.password, (err, user) => {
        if(err) console.log(err)
        // console.log(user)
        res.redirect('/farmer_one_dashboard')
        // res.send('Urban Farmer Registered')
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
