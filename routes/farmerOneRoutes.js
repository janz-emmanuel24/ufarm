const express = require('express')
const router = express.Router()
const connectEnsureLogin = require('connect-ensure-login')

//Imports
const Register_usersModel = require('../model/Register_usersModel');
const Produce_upload_model = require('../model/Produce_upload_model')

router.get('/', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    const urbanfarmers_produce = await Produce_upload_model.find();
    res.render('farmer_one_dashboard', {urbanfarmers_produce})
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


module.exports = router;
