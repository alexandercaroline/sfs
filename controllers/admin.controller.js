
let auth = require('../auth/auth')
exports.login = (req,res) =>{
    let errors = { }
    let error = false
    if (req.body.email == undefined ||req.body.email == ""){
        error = true
        errors.emailError = "please enter email"
 
    }
    if (req.body.password == undefined||req.body.password ==""){
       error = true
       errors.passwordError = "enter password"
     }
 
     if ( error){
        // console.log("ERROROROR")
         res.render('adminlogin',{
             errors : errors,
             models : {
                 password : req.body.password,
                 email : req.body.email
             }
         })
         return
     }
 
     
     let sql = "SELECT * FROM admins WHERE  email = '"+req.body.email+"'"
     
     //query the db
     db.query(sql,async (err,results)=>{
           // console.log("search")
         if(err){
             console.log(err)
    
             res.render('adminlogin',{
                 errors : {},
                 models : {
                     password : req.body.password,
                     email : req.body.email
                 }
             })
             return
         }
 

         if(results.length > 0){

             let valid = await auth.confirm(req.body.password,results[0].password)
             if(valid) {
                 
                // console.log(results)
                 req.session.userId = results[0].adminId
                
                 req.session.isAdmin=true
                 res.redirect('/admin')
                 return
             }
         }else{
                 res.render('adminlogin',{
                     errors : {
                         passwordError : "Invalid email or password",
                         emailError:"Invalid email or password"
                     },
                     models : {
                         password : req.body.password,
                         email : req.body.email
                     }
                 })
             }
 
           })
}

exports.addcrop = (req,res) => {
   
    let sql = `INSERT INTO crops(name,varieties,post) VALUES('${req.body.name}','${req.body.varieties}','${req.body.post}')`

    db.query(sql,(err,results)=>{
        if(err)
        {
            console.log(err)
            return
        }

        console.log("YEAH")
        res.send("OK")
    })

    
}
exports.getViewClients= (req,res) => {
    let sql = 'SELECT * FROM client'
    db.query(sql,async (err,results)=>{
        // console.log("search")
      let clients = []
      if(err){
          console.log(err)
      }

      if(results.length > 0){
          clients = results
      }

      res.render('admin/viewclients',{ clients : clients})
    })
}


exports.removeClient = (req,res) =>{
    let sql = `DELETE FROM orders WHERE clientID =${req.params.id}`
    let sql2 = `DELETE FROM client WHERE clientID = ${req.params.id}`

    db.query(sql,(err,results)=>{
        if(err){
          console.log(err)
          res.redirect('/admin/viewclients')
          return
        }

        db.query(sql2,(err,results)=>{
            if(err){
              console.log(err)
            }
            res.redirect('/admin/viewclients')
         })
        
     })
}

exports.getViewFarmers = (req,res) => {
    let sql = 'SELECT * FROM farmer'
    db.query(sql,async (err,results)=>{
        // console.log("search")
      let farmers = []
      if(err){
          console.log(err)
      }

      if(results.length > 0){
          farmers = results
      }

      res.render('admin/viewfarmers',{ farmers : farmers })
    })
}

exports.removeFarmer = (req,res) =>{
    let sql = `DELETE FROM farmer_uploads WHERE farmerID =${req.params.id}`
    let sql2 = `DELETE FROM farmer WHERE farmerID = ${req.params.id}`

    db.query(sql,(err,results)=>{
        if(err){
          console.log(err)
          res.redirect('/admin/viewfarmers')
          return
        }

        db.query(sql2,(err,results)=>{
            if(err){
              console.log(err)
            }
            res.redirect('/admin/viewfarmers')
         })
        
     })
}

exports.getViewOrders = (req,res) => {
    let sql = 'SELECT * FROM orders INNER JOIN client ON orders.clientID = client.clientID '
    db.query(sql,async (err,results)=>{
        // console.log("search")
      let orders = []
      if(err){
          console.log(err)
      }

      if(results.length > 0){
          orders = results
      }

      res.render('admin/vieworders',{ orders : orders })
    })
}

exports.removeOrder = (req,res) =>{
    let sql = `DELETE FROM orders WHERE id =${req.params.id}`
   
    db.query(sql,(err,results)=>{
        if(err){
          console.log(err)
          res.redirect('/admin/vieworders')
          return
        }

        res.redirect('/admin/vieworders')
        
     })
}

exports.getViewProducts = (req,res) => {
    let sql = 'SELECT * FROM farmer_uploads INNER JOIN farmer ON farmer_uploads.farmerID = farmer.farmerID '
    db.query(sql,async (err,results)=>{
        // console.log("search")
      let products = []
      if(err){
          console.log(err)
      }

      if(results.length > 0){
          products = results
      }
      res.render('admin/viewproducts',{ products : products })
    })
}

exports.removeProduct = (req,res) =>{
    let sql = `DELETE FROM farmer_uploads WHERE id =${req.params.id}`
   
    db.query(sql,(err,results)=>{
        if(err){
          console.log(err)
        }

        res.redirect('/admin/viewproducts')
     })
}

exports.searchFarmer = (req,res) => {
   
    let sql = `SELECT * FROM farmer WHERE created >= '${req.body.from}' AND created  <= '${req.body.to}' `
    db.query(sql,async (err,results)=>{
        // console.log("search")
        let farmers = []
        if(err){
            console.log(err)
        }

        if(results.length > 0){
            farmers = results
        }

        res.render('admin/viewfarmers',{ farmers : farmers })
    })
}