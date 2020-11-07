//create a router instance from express
const express = require('express')
const router = express.Router()

const authroutes = require('./auth.routes')
const farmerRouter = require('./farmer.routes')
const adminRouter = require('./admin.routes')
const clientRouter = require('./client.routes')

//require our controller
const con = require('../controllers/controller')
const farmercon= require('../controllers/farmer.controller')
const clientcon = require('../controllers/client.controller')

router.get('/',(req,res)=>{
   getHome(req,res)
})

router.get('/welcome',(req,res)=>{
    getHome(req,res)
})

function getHome(req,res){
    if(req.session.userId == undefined){
        res.render('index')
        return
    }

    if(req.session.admin){
        res.render('admin')
        return
    }

   if(req.session.isFarmer){
       farmercon.farmerhome(req,res)
       return
   }
   if(!req.session.isFarmer){
        clientcon.clienthome(req,res)
        return
   }
   res.render('index')
}




router.get('/farmersignup',(req,res)=>{
    res.render('farmersignup')
})
router.get('/login',(req,res)=>{
    res.render('login')
})

router.get('/clientsignup',(req,res)=>{
    res.render('clientsignup')
})

router.get('/cropdetails/:crop',con.cropdetails)

router.get('/chat',(req,res)=>{
    res.render('chat',{name :req.session.name})
})

router.use('/auth',authroutes)
router.use('/admin',adminRouter)
router.use('/farmer',farmerRouter)
router.use('/client',clientRouter)

module.exports = router