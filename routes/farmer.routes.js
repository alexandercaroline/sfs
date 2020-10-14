
//create a router instance from express
const express = require('express')
const router = express.Router()


//require our controller
const con = require('../controllers/farmer.controller')
var multer  = require('multer')

var upload = multer({ dest: 'public/uploads/crops' })


router.get('/farmerhome',con.farmerhome)

router.get('/addproduct',(req,res)=>{
    res.render('farmer/addproduct',{
        crops : cropsBackup
    })
})

router.post('/addproduct',upload.single('file'),con.addproduct)

router.get('/myproducts',con.getMyProducts)
router.get('/setsoldproduct/:id',con.setSold)
router.get('/orders',con.orderedProducts)
module.exports = router