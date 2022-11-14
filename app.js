//core modules
const path = require('path');
//dependencies
const express = require('express');
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const GoogleStrategy = require('passport-google-oauth20').Strategy

const connectEnsureLogin = require('connect-ensure-login')


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

// Get the Google_client ID and google client secret from Dev console
const GOOGLE_CLIENT_ID = '144277761760-1jakd3dsrosorgk4on9kvrdo2npgj3u2.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'

authUser = async (request, accessToken, refreshToken, profile, done) => {

    try {
        let existingUser = await RegisterPublicUsersModel.findOne({ 'google.id': profile.id})

        //if existing user exists, return the user
        if(existingUser) {
            return done(null, existingUser)
        }
        // if user does not exist - create new user
        console.log('Creating new user....')
        const newUser = new RegisterPublicUsersModel({
            method: 'google',
            google: {
                id: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                profile_photo: profile.photos[0].value
            }
        });

        await newUser.save()

        return done(null, newUser)

    } catch(e) {
        return done(error, false)
    }
}

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


//public
// passport.use('users', RegisterPublicUsersModel.createStrategy())
// //public
// passport.serializeUser(RegisterPublicUsersModel.serializeUser())
// passport.deserializeUser(RegisterPublicUsersModel.deserializeUser())

// public user strategy
passport.use(new GoogleStrategy({
   clientID: GOOGLE_CLIENT_ID,
   clientSecret: GOOGLE_CLIENT_SECRET,
   callbackURL: "http://localhost:3000/auth/google/callback"
}, authUser))

passport.serializeUser((user, done) => {
    // console.log(user)

    done(null, user)
})

passport.deserializeUser((user, done) => {
    // console.log(user)

    done(null, user)
})

//redirect the user to the google signin page
app.get('/auth/google', passport.authenticate('google', {scope: ['email', 'profile']}))

//once logged in redirect to the right page
app.get('/auth/google/callback', passport.authenticate('google', {successRedirect: '/categories_check', failureRedirect: '/user_login'}))

//Farmers
passport.use(RegisterUserModel.createStrategy())
//Farmers
passport.serializeUser(RegisterUserModel.serializeUser())
passport.deserializeUser(RegisterUserModel.deserializeUser())



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