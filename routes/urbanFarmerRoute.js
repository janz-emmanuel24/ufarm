const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    console.log(res.json())
})

router.get('/urbanFarmerUploads', (req, res) => {
    console.log(res.json())
})

router.get('/urbanFarmerDeclinedProduce', (req, res) => {
    console.log(res.json())
})

router.patch('/updateProduce', (req, res) => {
    console.log(res.json())
})

module.exports = router;