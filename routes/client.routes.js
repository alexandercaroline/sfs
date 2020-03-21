
//create a router instance from express
const express = require('express')
const router = express.Router()

//require our controller
const con = require('../controllers/client.controller')

router.get('/clienthome',con.clienthome)
router.get('/onsale',con.getOnSale)

module.exports = router