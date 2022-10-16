const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    console.log(res.json())
})

router.get('/:farmerOneID', (req, res) => {
    console.log(res.json())
})

router.post('/registerFarmerOne', (req, res) => {
    console.log(res.json())
})

router.patch('/:farmerOne', (req,res) => {
    console.log(res.json())
})


module.exports = router;