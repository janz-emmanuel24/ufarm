const router = require('express').Router()
const multer = require('multer')
const connectEnsureLogin = require('connect-ensure-login')

const Produce_upload_model = require('../model/Produce_upload_model')
const RegisterModel = require('../model/Register_usersModel')
const User_orders = require('../model/OrdersSchema')
const { request } = require('express')

//urban farmer controller
const urban_farmer_controller = require('../controller/urban_farmer_Controller')

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

//display urban farmer information
router.get('/', connectEnsureLogin.ensureLoggedIn('/login'), urban_farmer_controller.get_urban_farmer_dashboard(Produce_upload_model, User_orders))

//Upload a produce
router.post('/', connectEnsureLogin.ensureLoggedIn('/login'), upload.single("produce_image"), urban_farmer_controller.upload_produce(Produce_upload_model, RegisterModel))

//approving the order 
router.post('/approve_user_order/:order_id', connectEnsureLogin.ensureLoggedIn('/login'), urban_farmer_controller.approve_order(User_orders, Produce_upload_model))

//Update product availability
router.post('/update_product_availability/:product_id', connectEnsureLogin.ensureLoggedIn('/login'), urban_farmer_controller.update_product_availability(Produce_upload_model))

module.exports = router;