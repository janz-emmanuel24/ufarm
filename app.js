//core modules
const path = require('path');
//dependencies
const express = require('express');
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')


//Required
const RegisterUserModel = require('./model/Register_usersModel');
const RegisterPublicUsersModel = require('./model/Public_registration');

const configurations = require('./config/config')
const agricRoutes = require('./routes/agricOfficerRoutes')
const farmerOneRoutes = require('./routes/farmerOneRoutes');
const urbanFarmerRoutes = require('./routes/urbanFarmerRoutes');
const generalRoutes = require('./routes/publicUserRoutes')

const authRoutes = require('./routes/authRoutes')
const public_authRoutes = require('./routes/public_auth');

//pug config
app.set('view engine', 'pug')
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/agricOfficer'), path.join(__dirname, 'views/urbanFarmer'), path.join(__dirname, 'views/farmerOne'),  path.join(__dirname, 'views/BoxSelections')])

//express session setup
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}))

//middleware
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//initializing passport
app.use(passport.initialize())
//initializing passport to use sessions
app.use(passport.session())

//declaring static methods to use on the model
passport.use('level1', RegisterUserModel.createStrategy())

passport.use('level2', RegisterPublicUsersModel.createStrategy())

//Farmers
// passport.serializeUser(RegisterUserModel.serializeUser())
// passport.deserializeUser(RegisterUserModel.deserializeUser())

//public
passport.serializeUser(RegisterPublicUsersModel.serializeUser())
passport.deserializeUser(RegisterPublicUsersModel.deserializeUser())


/** DATABASE CONNECTIONS */
mongoose.connect(`${configurations.DB}`, {useNewUrlParser: true})
    .then(() => console.log('Connected to Database'))
    .catch(err => console.log(err))

//routes middleware
app.use('/', generalRoutes);
app.use('/agric_dashboard', agricRoutes)
app.use('/farmer_one_dashboard', farmerOneRoutes)
app.use('/urban_farmer_dashboard', urbanFarmerRoutes)
app.use('/', authRoutes);
app.use('/', public_authRoutes);


//routes
app.get('*', (req,res) => {
    res.status(400).send('Page Not Found')
})

const port = 3000 || process.env.PORT;


app.listen(`${port}`, () => {
    console.log(`App listening on port ${port}`)
})