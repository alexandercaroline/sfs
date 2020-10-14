let home = (req,res) => {
    let sql = "SELECT * FROM crops"
 
    db.query(sql,(err,results)=>{
       if(err){
           console.log(err)
           res.render('clienthome',{
               crops : []
           })
           return
       }
 
       if(results.length > 0){
           let crops = []
           results.forEach((row) =>{
               crops.push(row.name)
           })
           
           res.render('clienthome',{
             crops : crops
           })
           global.cropsBackup = crops
          return
       }
 
        res.render('client',{
            crops : []
        })

        global.cropsBackup = []
    })
 }

 exports.clienthome = home

 exports.getOnSale = (req,res) => {
    let sql = 'SELECT * FROM farmer_uploads JOIN farmer ON farmer_uploads.farmerID = farmer.farmerID WHERE sold = 0'

    db.query(sql,(err,results) => {
         if(err){
            home(req,res)
            return
         }

         res.render('onsale',{
             crops : cropsBackup,
             products: results
         })
    })
}


exports.makeOrder = (req,res)=>{
  
    let sql = `INSERT INTO orders(clientID,name,quantity,description) VALUES(${req.session.userId},'${req.body.name}',${req.body.quantity},'${req.body.description}')`
    db.query(sql,(err,results)=>{
        if(err){
            console.log(err)
        res.render('makeorder',{
            crops: global.cropsBackup,
            error : true
            })
            return
        }

        res.render('makeorder',{
            crops: global.cropsBackup,
            error : false
        })
    })

}

exports.myorders = (req,res) =>{
    let sql = `SELECT * FROM orders WHERE clientID = ${req.session.userId}`
 
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
           res.render('myorders',{
            crops : cropsBackup,
            products : products
          })
          return
       }
  
        res.render('myorders',{
          crops : cropsBackup,
          products :[]
        })
    })
}

exports.deleteOrder = (req,res) =>{
    let sql = `DELETE  FROM orders WHERE id = ${req.params.id}`

    db.query(sql,(err,results)=>{
     if(err){
       console.log(err)
     }
     res.redirect('/client/myorders')
  })
}