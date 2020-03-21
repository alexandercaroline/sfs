
const fs = require("fs")
const path = require('path')

exports.farmerhome= (req,res) => {
    let sql = "SELECT * FROM crops"
 
    db.query(sql,(err,results)=>{
       if(err){
           console.log(err)
           res.render('farmerhome',{
               crops : []
           })
           return
       }
 
       if(results.length > 0){
           let crops = []
           results.forEach((row) =>{
               crops.push(row.name)
           })
           
           res.render('farmerhome',{
             crops : crops
           })
           global.cropsBackup = crops
          return
       }
 
       res.render('farmerhome',{
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
      
        res.render('addproduct',{
           crops: global.cropsBackup,
           error : true
        })
        return
     }
     
     let sql = `INSERT INTO farmer_uploads(farmerID,name,image,price,quantity) VALUES(${req.session.userId},'${req.body.name}','${uploadName}',${req.body.price},${req.body.quantity})`
     db.query(sql,(err,results)=>{
        if(err){
          console.log(err)
          res.render('addproduct',{
            crops: global.cropsBackup,
            error : true
           })
           return
        }

        res.render('addproduct',{
          crops: global.cropsBackup,
          error : false
         })
     })

  

   })

  
 }