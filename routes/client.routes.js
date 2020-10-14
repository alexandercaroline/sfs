
//create a router instance from express
const express = require('express')
const router = express.Router()

//require our controller
const con = require('../controllers/client.controller')

router.get('/clienthome',con.clienthome)
router.get('/onsale',con.getOnSale)

router.get('/makeorder',(req,res)=>{
    res.render('makeorder',{
        crops : cropsBackup
    })
})

router.post('/makeorder',con.makeOrder)

router.get('/myorders',con.myorders)
router.get('/removeorder/:id',con.deleteOrder)
module.exports = router