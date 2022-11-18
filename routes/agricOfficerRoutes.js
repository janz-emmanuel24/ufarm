const router = require('express').Router()
const RegistrationModel = require('../model/Register_usersModel')
const UploadProduceModel = require('../model/Produce_upload_model')
const connectEnsureLogin = require('connect-ensure-login')

router.get('/', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    const logged_in_user = req.user
    const registeredFarmerOnes = await RegistrationModel.find({role: "farmer one"})
    const produce_images = await UploadProduceModel.find();

    console.log(produce_images);
    
    res.render('agric_officer_dashboard', {registeredFarmerOnes, logged_in_user, produce_images})
})


router.get('/updateFarmerOne/:farmerOne_id', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    const farmerOne_id = req.params.farmerOne_id;
    const logged_in_user = req.user
    const produce_images = await UploadProduceModel.find();
    const farmerOne = await RegistrationModel.findById({_id: farmerOne_id})    
    res.render('agUpdate_farmer_one', {farmerOne, logged_in_user, produce_images})
})

router.post('/updateFarmerOne/:farmerOne_id', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    const farmerOne_id = req.params.farmerOne_id;
    await RegistrationModel.findByIdAndUpdate(farmerOne_id, req.body)
    res.redirect('/agric_dashboard')
})


module.exports = router;