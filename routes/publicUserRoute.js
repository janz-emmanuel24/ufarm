const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    console.log(res.json())
})

router.get('/login', (req,res) => {
    console.log(res.json())
})

router.post('/register', (req, res) => {
    console.log(res.json)
})

router.patch('/:userID', (req, res) => {
    console.log(res.json)
})

module.exports = router;
