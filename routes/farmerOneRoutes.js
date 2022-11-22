const express = require('express')
const router = express.Router()
const connectEnsureLogin = require('connect-ensure-login')

//Imports
const Register_usersModel = require('../model/Register_usersModel');
const Produce_upload_model = require('../model/Produce_upload_model')
const User_orders = require('../model/OrdersSchema')

//farmerOne controller
const farmer_one_controller = require('../controller/farmer_one_Controller')

router.get('/', connectEnsureLogin.ensureLoggedIn('/login'), farmer_one_controller.get_farmer_one_dashboard(Register_usersModel, Produce_upload_model, User_orders))

router.post('/approve_decline/:productId',connectEnsureLogin.ensureLoggedIn('/login'), farmer_one_controller.approve_decline_produce(Produce_upload_model))

module.exports = router;
