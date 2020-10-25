
//create a router instance from express
const express = require('express')
const router = express.Router()


//require our controller
const admincon = require('../controllers/admin.controller')

router.get('/',(req,res)=>{
   if(req.session.userId == undefined || req.session.isAdmin == false){
       res.render('adminlogin')
       return
   }
   res.render('admin/admin')
})

router.get('/login',(req,res)=>{
    res.render('adminlogin')
})

router.post('/login',admincon.login)

router.get('/addcrop',(req,res)=>{
    res.render('admin/addcrop')
})

router.get('/viewclients',(req,res)=>{
    res.render('admin/viewclients')
})

router.get('/viewfarmers',(req,res)=>{
    res.render('admin/viewfarmers') 
})

router.get('/vieworders',(req,res)=>{
    res.render('admin/vieworders') 
})

router.get('/viewproducts',(req,res)=>{
    res.render('admin/viewproducts') 
})



router.post('/addcrop',admincon.addcrop)



module.exports = router