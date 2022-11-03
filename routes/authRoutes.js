const router = require('express').Router()
const passport = require('passport')
const connectEnsureLogin = require('connect-ensure-login')

const RegisterUserModel = require('../model/Register_usersModel')

//Farmers
passport.serializeUser(RegisterUserModel.serializeUser())
passport.deserializeUser(RegisterUserModel.deserializeUser())

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', passport.authenticate('level1', {failureRedirect: '/login'}), (req, res) => {
    //if login is successful - redirect to the right page
    req.session.user = req.user;

    let user = req.session.user;
    console.log(user.loginId, user.role)

    if(user.role == 'urban farmer') {
        res.redirect('/urban_farmer_dashboard')
    } else if(user.role == 'farmer one') {
        res.redirect('/farmer_one_dashboard')
    } else if(user.role == 'agricultural officer') {
        res.redirect('/agric_dashboard')
    } else {
        res.send('Session Expired or User not registered')
    }
})

router.post('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(function(err) {
            if(err) {
                res.status(400).send('Unable to Log out')
            } else {
                return res.redirect('/')
            }
        })
    }
})

router.post('/farmer_one_dashboard/register_urban_farmer', connectEnsureLogin.ensureLoggedIn(), async (req,res) => {
    const registerUrbanFarmers = new RegisterUserModel(req.body);
    await RegisterUserModel.register(registerUrbanFarmers, req.body.password, (err, user) => {
        if(err) console.log(err)
        // console.log(user)
        res.redirect('/farmer_one_dashboard')
        // res.send('Urban Farmer Registered')
    })
})

router.post('/agric_dashboard/registerFarmerOnes', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    const RegisterFarmerOne = new RegisterUserModel(req.body)
    // console.log(RegisterFarmerOne)
    await RegisterUserModel.register(RegisterFarmerOne, req.body.password, function (err, user){
        if(err) {console.log(err)}
        // console.log(user)
        res.redirect('/agric_dashboard')
    })
})

module.exports = router