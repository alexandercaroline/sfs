//create a router instance from express
const express = require('express')
const router = express.Router()


//require our controller
const con = require('../controllers/auth.controller')



router.post('/farmersignup',con.farmersignup)
router.post('/clientsignup',con.clientsignup)
router.post('/login',con.login)
router.get('/logout',con.logout)


module.exports = router