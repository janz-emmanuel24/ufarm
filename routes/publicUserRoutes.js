const express = require('express')
const router = express.Router()

const Produce_upload_model = require('../model/Produce_upload_model');
const RegisterPublicUsersModel = require('../model/Public_registration')

router.get('/', (req, res) => {
    res.render('landingpage')
})

router.get('/our_farmers', (req,res) => {
    res.render('ourfarmers')
})

router.get('/categories_in_shop', async (req, res) => {
    res.render('categories')
})

router.get('/horticulture', async (req, res) => {
    const all_horticulture_produces = await Produce_upload_model.aggregate([{$match: {produce_type: "horticulture"}}])
    res.render('horticulture')
})

router.get('/dairy', async (req, res) => {
    const all_dairy_produces = await Produce_upload_model.aggregate([{$match: {produce_type: "dairy"}}])

    res.render('dairy')
})

router.get('/poultry', (req, res) => {
    res.render('poultry')
})

router.get('/vegetables', async (req, res) => {
    const all_vegetable_produces = await Produce_upload_model.aggregate([{$match: {produce_type: "horticulture"}}])

    res.render('vegetables', {all_approved_produces})
})

router.get('/fruits', async (req, res) => {
    const all_fruits_produces = await Produce_upload_model.aggregate([{$match: {produce_type: "horticulture"}}])

    res.render('fruits', {})
})

router.post('/user_signup', async (req,res) => {
    const RegisterPublicUsers = new RegisterPublicUsersModel(req.body)

    console.log(req.body.password)

    console.log(RegisterPublicUsers);

    // await publicUserRegistration.save()

    await RegisterPublicUsersModel.register(RegisterPublicUsers, req.body.password)
})

module.exports = router;
