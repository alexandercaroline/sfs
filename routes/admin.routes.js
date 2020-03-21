
//create a router instance from express
const express = require('express')
const router = express.Router()


//require our controller
const admincon = require('../controllers/admin.controller')

router.get('/',(req,res)=>{
   if(req.session.userId == undefined){
       res.render('adminlogin')
       return
   }
   res.render('admin')
})

router.get('/login',(req,res)=>{
    res.render('admin')
})

router.post('/login',admincon.login)

router.post('/addcrop',admincon.addcrop)

router.get('/addcrop',(req,res)=>{
    res.render('admin')
})

module.exports = router