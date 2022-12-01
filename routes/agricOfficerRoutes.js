const router = require('express').Router()
const RegistrationModel = require('../model/Register_usersModel')
const UploadProduceModel = require('../model/Produce_upload_model')
const connectEnsureLogin = require('connect-ensure-login')

//agricultural officer controller
const agricultural_officer_controller = require('../controller/agricultural_officer_Controller')


router.get('/', connectEnsureLogin.ensureLoggedIn('/login'), agricultural_officer_controller.get_dashboard(RegistrationModel, UploadProduceModel))

router.get('/updateFarmerOne/:farmerOne_id', connectEnsureLogin.ensureLoggedIn('/login'), agricultural_officer_controller.get_farmer_one_to_update(UploadProduceModel, RegistrationModel))

router.post('/updateFarmerOne/:farmerOne_id', connectEnsureLogin.ensureLoggedIn('/login'), agricultural_officer_controller.update_farmer_one(RegistrationModel))

//farmer One registration
router.post('/registerFarmerOnes', connectEnsureLogin.ensureLoggedIn('/login'), async (req, res) => {
    const RegisterFarmerOne = new RegistrationModel(req.body)
    console.log(RegisterFarmerOne)
    await RegistrationModel.register(RegisterFarmerOne, req.body.password, function (err, user){
        if(err) {console.log(err)}
        // console.log(user)
        res.redirect('/agric_dashboard')
    })
})

module.exports = router;