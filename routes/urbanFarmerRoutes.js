const router = require('express').Router()
const multer = require('multer')
const connectEnsureLogin = require('connect-ensure-login')

const Produce_upload_model = require('../model/Produce_upload_model')
const RegisterModel = require('../model/Register_usersModel')

//image upload
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads")
    }, 
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

//instantiating a variable to store multer's functionality
var upload = multer({storage: storage})

router.get('/', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    //sets the user session to req.user which is the current user
    req.session.user = req.user
    
    //Get all produces upload by this particular user
    const userProduces = await Produce_upload_model.find({produce_owner: req.user})

    // console.log(req.user)

    const loggedInUrbanFarmer = await RegisterModel.findById(req.user._id)

    // console.log('This is the logged in urban farmer', loggedInUrbanFarmer)

    // console.log("The uploaded produce", userProduces);

    //we are passing the user session data to the user object key
    res.render('urban_farmer_dashboard', {userProduces, loggedInUrbanFarmer})
})


router.post('/', connectEnsureLogin.ensureLoggedIn(), upload.single("produce_image"), async (req, res) => {

    req.session.user = req.user

    try {
        const produce = new Produce_upload_model(req.body)

        produce.produce_image = req.file.path;
        produce.produce_owner = req.user._id;

        console.log("This is from the produce", produce.produce_owner)
        console.log("This is from the req.user", req.user._id)

        const ownerDetails = await RegisterModel.findById(produce.produce_owner)

        produce.fullname = ownerDetails.fullname;
        produce.contact = ownerDetails.phone;


        // console.log(produce)

        await produce.save();

        res.redirect('/urban_farmer_dashboard')

    } catch(err) {
        console.log(err)
    }
})

module.exports = router;