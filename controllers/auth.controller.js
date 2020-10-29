
let auth = require('../auth/auth')
let mailer = require('../mail/mailer')
//handles the login request
exports.login = (req,res) => {
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
        res.render('login',{
            errors : errors,
            models : {
                password : req.body.password,
                email : req.body.email
            }
        })
        return
    }

    
    let sql = "SELECT * FROM farmer WHERE  email = '"+req.body.email+"'"
    
    //query the db
    db.query(sql,async (err,results)=>{
          // console.log("search")
        if(err){
            console.log(err)
           // console.log("error search")
            res.render('login',{
                errors : {},
                models : {
                    password : req.body.password,
                    email : req.body.email
                }
            })
            return
        }

        //if we have some rows returned length of results will be one
        //results is json aray , with the returned rows as json objects within the array
        if(results.length > 0){
            //console.log("founnd")
            let valid = await auth.confirm(req.body.password,results[0].password)
            if(valid) {
                
               // console.log(results)
                req.session.userId = results[0].farmerID
                req.session.isFarmer = true
                req.session.isAdmin = false
                res.redirect('/welcome')
                return
            }
        }else {
          let sql = "SELECT * FROM client WHERE  email = '"+req.body.email+"'"
          console.log("CLIENt")
          db.query(sql,async (err,results)=>{ 
            if(err){
                console.log("err")
                res.render('login',{
                    errors : {},
                    models : {
                        password : req.body.password,
                        email : req.body.email
                    }
                })
                return
            }

            console.log(results)
           
            if(results.length > 0){
                let valid = await auth.confirm(req.body.password,results[0].password)
                if(valid) {
                    req.session.userId = results[0].clientID
                    req.session.isFarmer = false
                    req.session.isAdmin = false
                    res.redirect('/welcome')
                    return
                }
            }else{
                res.render('login',{
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

          //
        }
        
        
    })

   
}

exports.logout = (req,res) => {
   req.session.userId = undefined
   req.session.isFarmer = undefined
   req.session.isAdmin = undefined
   req.session.destroy(function(err) {
      res.redirect('/')
   })
  
}


exports.farmersignup = async (req,res) =>{
    //get our pass and username
    
    let email = req.body.email
    let fName = req.body.fName
    let lName = req.body.lName
    let location = req.body.location
    let county = req.body.county
    let phone = req.body.phone
    let password = req.body.password
    //console.log("P"+password)
    let conPassword = req.body.conPassword   

    let error = false
    let errors = checkEmpty(password,email,fName,lName,phone,conPassword,location,county)
    error = errors.error

    
    if( errors.passwordError == undefined && password.length < 8){
        errors.passwordError = " Password should  be more than 7 characters"
        error = true
    }

    if(errors.passwordError == undefined  && (password !== conPassword)){
        errors.passwordError = " Password do not match"
        errors.conPasswordError= "Password do not  match"
        error = true
    }
    
    if (phoneError == undefined){
        if((phone.charAt(0) == '0' && phone.length != 10) || (phone.charAt(0) == '2' && phone.length != 12)){
            errors.phoneError = "Enter valid phone number"
            error = true
        }
    }
    
    //if user found return the message and id
    if(error){
        res.render('farmersignup',{ errors : errors,models: {
            email :email,
            fName :fName,
            lName : lName,
            phone : phone,
            password: password,
            conPassword : conPassword,
            location : location,
            county : county
        }})
        return
    }
    
    
    //hash pass
    let hash = await auth.hash(password)

      //insterts the created user with the hashed pasword to db
    let sql = `INSERT INTO farmer(email,fname,lname,phoneno,password,location,county) VALUES('${email}','${fName}','${lName}','${phone}','${hash}','${location}','${county}')`
        
      db.query(sql,(err,results) =>{
          if(err){
              console.log(err)
            res.render('farmersignup',{ errors : errors,models: {
                email :email,
                fName :fName,
                lName : lName,
                phone : phone,
                password: password,
                conPassword : conPassword,
                location : location,
                county : county
            }})
              return
          }

          res.render('login')
      })
  
} 


exports.clientsignup = async (req,res) =>{
    //get our pass and username
    
    let email = req.body.email
    let fName = req.body.fName
    let lName = req.body.lName
    let phone = req.body.phone
    let password = req.body.password
    
    let conPassword = req.body.conPassword   

    let error = false
    let errors = checkEmpty(password,email,fName,lName,phone,conPassword)
    error = errors.error

    
        if( errors.passwordError == undefined && password.length < 8){
            errors.passwordError = " Password should  be more than 7 characters"
            error = true
        }

        if(errors.passwordError == undefined  && (password !== conPassword)){
            errors.passwordError = " Password do not match"
            errors.conPasswordError= "Password do not  match"
            error = true
        }
   
    
    //if user found return the message and id
    if(error){
        res.render('clientsignup',{ errors : errors,models: {
            email :email,
            fName :fName,
            lName : lName,
            phone : phone,
            password: password,
            conPassword : conPassword
        }})
        return
    }
    


    //hash pass
    let hash = await auth.hash(password,email,fName,lName,phone)

    let sql = `INSERT INTO client(email,fname,lname,phoneno,password) VALUES('${email}','${fName}','${lName}','${phone}','${hash}')`
          
      db.query(sql,(err,results) =>{
          if(err){
            res.render('clientsignup',{ errors : errors,models: {
                email :email,
                fName :fName,
                lName : lName,
                phone : phone,
                password: password,
                conPassword : conPassword
            }})
            return
        
          }
          res.render('login')

      })
  
}

function checkEmpty(password,email,fName,lName,phone,conPassword,location = "none",county = "none"){
    let errors = {}
    errors.error =false

    if (password == undefined ||password==""){
        errors.passwordError="Password cannot be empty !"
        errors.error = true
    }
    
    if (email == undefined ||email==""){
        errors.emailError="email empty !"
        errors.error = true
    }
    if (fName == undefined ||fName==""){
        errors.fNameError="first name empty !"
        errors.error = true
    }
    if (lName == undefined ||lName==""){
        errors.lNameError="Last name empty !"
        errors.error = true
    }
    if (phone == undefined ||phone==""){
        errors.phoneError="phone number slot  is empty !"
        errors.error = true
    }
    if (conPassword == undefined ||conPassword==""){
        errors.conPasswordError="kindly confirm your password!"
        errors.error = true
    }
    if (location == undefined || location == ""){
        errors.locationError ="kindly enter your location"
        errors.error = true
    }
    if (county == undefined || county == ""){
        errors.countyError ="kindly select your county"
        errors.error = true
    }
    
    return errors;
}


async function sendMail(res,req,user){
    let code =  Math.floor(1000 + Math.random() * 9000);
   
    let response = await mailer.sendMail(req.body.email,"SFS PASSWORD RESET CODE",`${code}`)
  
    if(response){
         let sql = `INSERT INTO  reset_code(email,code,user) VALUES('${req.body.email}','${code}',''${user}')`
         db.query(sql,(err,results) => {
             if(err){
                console.log(err)
             }
      
             res.render('changepassword')
        })
    }else{
        res.render('forgotpassword',{
            errors : {emailError : "Failed to send code"},
            models : {
                email : req.body.email
            }
        }) 
    }
}
exports.forgotPassword = async (req,res) =>{

    let sql = "SELECT * FROM farmer WHERE  email = '"+req.body.email+"'"
    //query the db
    db.query(sql,async (err,results)=>{
          // console.log("search")
        if(err){
            console.log(err)
        }

        if(results.length > 0){
            sendMail(res,req,'farmer')
        }else {
          let sql = "SELECT * FROM client WHERE  email = '"+req.body.email+"'"
     
          db.query(sql,async (err,results)=>{ 
            if(err){
                console.log("err")
            }
           
            if(results.length > 0){
                sendMail(res,req,'client')
            }else{
                res.render('forgotpassword',{
                    errors : {emailError : "Not a valid user"},
                    models : {
                        email : req.body.email
                    }
                }) 
            }

          })

        }}) 
}

exports.changePassword = (req,res) =>{
    let sql = `SELECT * FROM reset_code WHERE code = '${req.body.code}'`

    if( req.body.password.length < 8){
        res.render('changepassword',{
            errors : { passwordError : "Password must the 8 characters or more" },
            models : {
                email : req.body.email,
                password : req.body.password
            }
        }) 
        return
    }
    
    db.query(sql,async (err,results)=>{ 
        if(err){
            console.log("err")
            return
        }
       
        if(results.length > 0){
            let newHash =  await auth.hash(password)
            let sql= `UPDATE ${result.user} SET password = ${newHash} WHERE email = ${req.body.email}`
            db.query(sql,async (err,results)=>{ 
                if(err){
                    res.render('changepassword',{
                        errors : { passwordError : "Error changing password " },
                        models : {
                            email : req.body.email,
                            password : req.body.password
                        }
                    }) 
                    return
                }

                res.redirect('/login')
            })
           
        }else{
            res.render('changepassword',{
                errors : { codeError : "Code not a valid " },
                models : {
                    email : req.body.email,
                    password : req.body.password
                }
            }) 
        }

      })

}