//core modules
const path = require('path');
//dependencies
const express = require('express');
const app = express()
const mongoose = require('mongoose')
const configurations = require('./config/config')

//requireModels
const AgricOfficerModel = require('./model/AgricOfficerModel');

//pug config
app.set('view engine', 'pug')
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/agricOfficer'), path.join(__dirname, 'views/farmerOne'),  path.join(__dirname, 'views/BoxSelections')])

//middleware
// app.use('/public/uploads', express.static(__dirname + '/public/uploads')) 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(`${__dirname}/public`))

/** DATABASE CONNECTIONS */
mongoose.connect(`${configurations.DB}`, {useNewUrlParser: true})
    .then(() => console.log('Connected to Database'))
    .catch(err => console.log(err))

//routes
app.get('/', (req,res) => {
    res.status(200).render('landingpage')
})

app.get('/agricOfficer', async (req, res) => {
    const registeredFarmerOnes = await AgricOfficerModel.find()
    // console.log(registeredFarmerOnes)
    res.render('agricOfficerDashboard', {registeredFarmerOnes: registeredFarmerOnes})
    // res.send(registeredFarmerOnes);
})

app.post('/registerFarmerOnes', async (req,res) => {
    const farmerOneRegistration = new AgricOfficerModel(req.body)
    // farmerOneRegistration.activities = ['register', 'approve']
    res.send(farmerOneRegistration)
    await farmerOneRegistration.save();
})

app.get('/updateFarmerOne/:farmerOneId', async (req, res) => {
    const farmerOneId = req.params.farmerOneId;
    const farmerOne = await AgricOfficerModel.findOne({_id: farmerOneId})
    // console.log(farmerOne)
    res.render('agricOfficerUpdateFarmerOne', {farmerOne: farmerOne})
})

app.post('/updateFarmerOne/:farmerOneId', async (req, res) => {
    const farmerOneId = req.params.farmerOneId;
    await AgricOfficerModel.findByIdAndUpdate(farmerOneId, req.body)
    res.redirect('/agricOfficer')
})

app.get('/farmerOne', (req, res) => {
    res.render('farmerOneDashboard')
})

app.get('/categoriesInShop', (req, res) => {
    res.render('categoriesInShop')
})

app.get('/categoriesInShop/vegetables', (req, res) => {
    res.render('vegetables')
})



const port = 4000 || process.env.PORT;


app.listen(`${port}`, () => {
    console.log(`App listening on port ${port}`)
})