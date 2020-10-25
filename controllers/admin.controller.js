
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