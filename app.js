//core modules
const path = require('path');
//dependencies
const express = require('express');
const app = express()

//routes
const agricOfficerRoutes = require('./routes/agricOfficerRoute');
const farmerOneRoutes = require('./routes/farmerOneRoute')
const urbanFarmerRoutes = require('./routes/urbanFarmerRoute')
const publicUserRoutes = require('./routes/publicUserRoute')

//pug config
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

//middleware
// app.use('/public/uploads', express.static(__dirname + '/public/uploads')) 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(`${__dirname}/public`))

//Routes middleware
app.use('/agricOfficer', agricOfficerRoutes);
app.use('/farmerOne', farmerOneRoutes)
app.use('/urbanFarmer', urbanFarmerRoutes)
app.use('/publicUser', publicUserRoutes)



//routes
app.get('/', (req,res) => {
    res.status(200).render('landingpage')
})

const port = 4000 || process.env.PORT;


app.listen(`${port}`, () => {
    console.log(`App listening on port ${port}`)
})