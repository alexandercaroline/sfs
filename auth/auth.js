//bycrypt package used for encryption and hashing
const bycrpt = require('bcrypt')

//hashes a password and stores the user in the db
exports.hash = async (password) =>{
    return new Promise(resolve => {
      
        //function to hash
        //takes the text to hash and a salt in this case 10
        //the the callback function
        bycrpt.hash(password,10,(err,hash)=>{
          resolve(hash)
       })
    })

}

//checks if the given password mataches the stored one in db
exports.confirm = (pass,hash)=> {
    return new Promise(resolve => {
        //function in byrpt used to compare a plain text to a hash
        //takes the plain text then the hash   
        bycrpt.compare(pass,hash,(err,res)=>{
             //if an error occurs or the hash doesn't match 
             //return false 
             if(err || !res){
                 console.log(err || res)
                 resolve(false)
             }
             //if password matches return true
             resolve(true)
        })
    })
}