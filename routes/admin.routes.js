
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

router.get('/viewclients',admincon.getViewClients)
router.get('/client/remove/:id',admincon.removeClient)

router.get('/viewfarmers',admincon.getViewFarmers)
router.get('/farmer/remove/:id',admincon.removeFarmer)

router.get('/vieworders',admincon.getViewOrders)
router.get('/order/remove/:id',admincon.removeOrder)

router.get('/viewproducts',admincon.getViewProducts)
router.get('/product/remove/:id',admincon.removeProduct)



router.post('/addcrop',admincon.addcrop)



module.exports = router