const router = require('express').Router()
const RegistrationModel = require('../model/Register_usersModel')
const connectEnsureLogin = require('connect-ensure-login')

router.get('/', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    const registeredFarmerOnes = await RegistrationModel.find({role: "farmer one"})
    console.log(registeredFarmerOnes);
    res.render('agric_officer_dashboard', {registeredFarmerOnes})
})


router.get('/updateFarmerOne/:farmerOne_id', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    const farmerOne_id = req.params.farmerOne_id;
    const farmerOne = await RegistrationModel.findById({_id: farmerOne_id})    
    res.render('agUpdate_farmer_one', {farmerOne})
})

router.post('/updateFarmerOne/:farmerOne_id', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    const farmerOne_id = req.params.farmerOne_id;
    await RegistrationModel.findByIdAndUpdate(farmerOne_id, req.body)
    res.redirect('/agric_dashboard')
})


module.exports = router;