const express = require('express')
const router = express.Router()
const passport = require('passport')
const connectEnsureLogin = require('connect-ensure-login')

const Produce_upload_model = require('../model/Produce_upload_model');
const OrderSchemaModel = require('../model/OrdersSchema')
const Public_User = require('../model/Public_registration')

//Controller
const public_user_controllers = require('../controller/public_user_Controllers')

/** OPEN PUBLIC ROUTES */

router.get('/', public_user_controllers.get_Homepage)

router.get('/our_farmers', public_user_controllers.our_farmers)

router.get('/categories_in_shop', public_user_controllers.categories_in_shop(Produce_upload_model))

router.get('/horticulture', public_user_controllers.horticulture(Produce_upload_model))

router.get('/dairy', public_user_controllers.dairy(Produce_upload_model))

router.get('/poultry', public_user_controllers.poultry(Produce_upload_model))


/** CLOSED PUBLIC ROUTES */

router.get('/categories_check', connectEnsureLogin.ensureLoggedIn('/user_login'), public_user_controllers.categories_check(Produce_upload_model))

router.get('/my_orders', connectEnsureLogin.ensureLoggedIn('/user_login'), public_user_controllers.my_orders(OrderSchemaModel))

router.post('/create_booking', connectEnsureLogin.ensureLoggedIn('/user_login'), public_user_controllers.create_booking(OrderSchemaModel, Produce_upload_model, Public_User))



module.exports = router;
