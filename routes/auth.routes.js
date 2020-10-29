//create a router instance from express
const express = require('express')
const router = express.Router()


//require our controller
const con = require('../controllers/auth.controller')



router.post('/farmersignup',con.farmersignup)
router.post('/clientsignup',con.clientsignup)
router.post('/login',con.login)
router.get('/logout',con.logout)
router.get('/forgotpassword',(req,res)=>{
    res.render('forgotpassword')
})
router.post('/forgotpassword',con.forgotPassword)

router.get('/changepassword',(req,res)=>{
    res.render('changepassword')
})

router.post('/changepassword',con.changePassword)
module.exports = router