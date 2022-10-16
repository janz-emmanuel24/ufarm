const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    console.log(res.json())
})

router.get('/:urbanFarmerID', (req,res) => {
    console.log(res.json())
})

router.delete('/:urbanFarmerID', (req, res) => {
    console.log(res.json)
})

router.patch('/:urbanFarmerID', (req, res) => {
    console.log(res.json)
})

router.get('/:urbanFarmerID/uploadedProduce', (req,res) => {
    console.log(res.json())
})

router.get('/:urbanFarmerID/approvedProduce', (req,res) => {
    console.log(res.json())
})

router.get('/bookings', (req,res) => {
    console.log(res.json())
})

router.get('/:userID/approvedBookings', (req,res) => {
    console.log(res.json())
})

module.exports = router;
