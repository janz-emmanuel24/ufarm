const router = require('express').Router()
const passport = require('passport')

const RegisterPublicUsersModel = require('../model/Public_registration');

router.get('/user_signup', (req,res) => {
    res.render('public_user_signup')
})

router.get('/user_login', (req,res) => {
    res.render('public_user_login')
})

router.post('/user_login', passport.authenticate('level2', {failureRedirect: '/user_login'}), (req,res) => {
    req.session.user = req.user
    console.log(req.session.user)
    res.send('Logged in successful')
})


module.exports = router
