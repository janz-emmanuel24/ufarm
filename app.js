//core modules
const path = require('path');
//dependencies
const express = require('express');

const app = express()

//pug config
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

//middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(`${__dirname}/public`))


//routes
app.get('/', (req,res) => {
    res.status(200).render('landingpage')
})

const port = 3000 || process.env.PORT;


app.listen(`${port}`, () => {
    console.log(`App listening on port ${port}`);
})