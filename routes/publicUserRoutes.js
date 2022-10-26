const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('landingpage')
})

router.get('/our_farmers', (req,res) => {
    res.render('ourfarmers')
})

router.get('/categories_in_shop', (req, res) => {
    res.render('categories')
})

router.get('/horticulture', (req, res) => {
    res.render('horticulture')
})

router.get('/dairy', (req, res) => {
    res.render('dairy')
})

router.get('/poultry', (req, res) => {
    res.render('poultry')
})

router.get('/vegetables', (req, res) => {
    res.render('vegetables')
})

router.get('/fruits', (req, res) => {
    res.render('fruits')
})

// router.post('/register', (req, res) => {
//     console.log(res.json)
// })

// router.patch('/:userID', (req, res) => {
//     console.log(res.json)
// })

module.exports = router;
