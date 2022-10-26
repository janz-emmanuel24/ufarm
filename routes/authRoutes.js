const router = require('express').Router()
const passport = require('passport')

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), (req, res) => {
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

module.exports = router