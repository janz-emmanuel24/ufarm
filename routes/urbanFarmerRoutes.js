const router = require('express').Router()
const multer = require('multer')
const connectEnsureLogin = require('connect-ensure-login')

const Produce_upload_model = require('../model/Produce_upload_model')

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

    console.log("The uploaded produce", userProduces);

    //we are passing the user session data to the user object key
    res.render('urban_farmer_dashboard', {userProduces})
})


router.post('/', connectEnsureLogin.ensureLoggedIn(), upload.single("produce_image"), async (req, res) => {

    req.session.user = req.user

    try {
        const produce = new Produce_upload_model(req.body)

        produce.produce_image = req.file.path;
        produce.produce_owner = req.user._id

        console.log(produce)

        await produce.save();

        res.redirect('/urban_farmer_dashboard')

    } catch(err) {
        console.log(err)
    }
})

module.exports = router;