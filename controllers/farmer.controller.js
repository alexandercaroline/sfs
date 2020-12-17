
const fs = require("fs")
const path = require('path')

let auth = require('../auth/auth')

exports.farmerhome= (req,res) => {
    let sql = "SELECT * FROM crops"
 
    db.query(sql,(err,results)=>{
       if(err){
           console.log(err)
           res.render('farmer/farmerhome',{
               crops : []
           })
           return
       }
 
       if(results.length > 0){
           let crops = []
           results.forEach((row) =>{
               crops.push(row.name)
           })
           
           res.render('farmer/farmerhome',{
             crops : crops
           })
           global.cropsBackup = crops
          return
       }
 
       res.render('farmer/farmerhome',{
         crops : []
       })
       global.cropsBackup = []
    })
 }

 exports.addproduct = (req,res) =>{
  const tempPath = path.join(__dirname, "../"+req.file.path)
  const uploadName = "/uploads/crops/"+(Math.round(+new Date()/1000) + new Date().getTime())+path.extname(req.file.originalname)
  const targetPath = path.join(__dirname, "../public"+uploadName)

   fs.rename(tempPath,targetPath, err =>{
     if(err){
      
        res.render('farmer/addproduct',{
           crops: global.cropsBackup,
           error : true
        })
        return
     }
     
     let sql = `INSERT INTO farmer_uploads(farmerID,name,image,price,quantity) VALUES(${req.session.userId},'${req.body.name}','${uploadName}',${req.body.price},${req.body.quantity})`
     db.query(sql,(err,results)=>{
        if(err){
          console.log(err)
          res.render('farmer/addproduct',{
            crops: global.cropsBackup,
            error : true
           })
           return
        }

        res.render('farmer/addproduct',{
          crops: global.cropsBackup,
          error : false
         })
     })
   })
 }

 exports.getMyProducts = (req,res) => {
  let sql = `SELECT * FROM farmer_uploads WHERE farmerID = ${req.session.userId}`
 
  db.query(sql,(err,results)=>{
     if(err){
         res.redirect('/')
         return
     }
   
     if(results.length > 0){
         let products = []

         results.forEach((row) =>{
            products.push(row)
         })
         console.log(products)
         res.render('farmer/myproducts',{
          crops : cropsBackup,
          products : products
        })
        return
     }

      res.render('farmer/myproducts',{
        crops : cropsBackup,
        products :[]
      })
  })
   
 }

 exports.setSold = (req,res) =>{
   let sql = `UPDATE farmer_uploads SET sold = 1 WHERE id = ${req.params.id}`

   db.query(sql,(err,results)=>{
    if(err){
      console.log(err)
    }
    res.redirect('/farmer/myproducts')
 })
 }

 exports.orderedProducts = (req,res) => {
  let sql = 'SELECT * FROM orders JOIN client ON orders.clientID = client.clientID'

  db.query(sql,(err,results) => {
       if(err){
          res.redirect('/')
          return
       }

       res.render('orders',{
           crops : cropsBackup,
           products: results
       })
  })
 }

 exports.searchOrders = (req,res)=>{
   let sql = `SELECT * FROM orders JOIN client ON orders.clientID = client.clientID AND orders.name like '%${req.body.name}%'`

   db.query(sql,(err,results) => {
        if(err){
           console.log(err)
           res.redirect('/')
           return
        }
 
        res.render('orders',{
            crops : cropsBackup,
            products: results
        })
   })
 }

 exports.getEditProfile = (req,res) =>{
    let sql = `SELECT * FROM farmer WHERE farmerID =  ${req.session.userId}`

    db.query(sql,(err,results) => {
      if(err){
         console.log(err)
         res.redirect('/')
         return
      }

      res.render('edit',{
         crops : cropsBackup,
         farmer : results[0],
         success : success ? true : null
     }
     )
  })
   
 }

 exports.editProfile = async (req,res)=>{
    let sql = `UPDATE farmer SET fname = '${req.body.fname}',lname = '${req.body.lname}',email = '${req.body.email}' WHERE farmerID = ${req.session.userId}`
     
    db.query(sql,async(err,results) => {
      
      if(err){
         res.redirect('/farmer/edit');
         return
      }

      if(req.body.password != ""){
          //hash pass
         let hash = await auth.hash(req.body.password)
         sql = `UPDATE farmer SET password = '${hash}' WHERE farmerID = ${req.session.userId}`

         db.query(sql,(err,results) => {
            if(err){
               console.log(err)
               res.redirect('/farmer/edit');
               return
            }
            success=true
            res.redirect('/farmer/edit');
         })
      }else{
          success=true
          res.redirect('/farmer/edit');
      }
    
  })

 }