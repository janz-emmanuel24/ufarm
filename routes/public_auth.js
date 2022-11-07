const router = require('express').Router()
const passport = require('passport')


const RegisterUserModel = require('../model/Public_registration')
const RegisterPublicUsersModel = require('../model/Public_registration')



router.get('/user_signup', (req,res) => {
    res.render('public_user_signup')
})

router.get('/user_login', (req,res) => {
    res.render('public_user_login')
})

// router.post('/user_login', passport.authenticate('users', {failureRedirect: '/user_login'}), (req,res) => {

//     // if(req.session) {
//     //     req.session.destroy()
//     //     // req.session.destroy(function(err) {
//     //     //     if(err) {
//     //     //         res.status(400).send('Unable to Log out')
//     //     //     } else {
//     //     //         return res.redirect('/')
//     //     //     }
//     //     // })
//     // }

//     req.session.user = req.user

//     let user = req.session.user

//     console.log(user)

//     res.redirect('/categories_in_shop')
// })


module.exports = router
