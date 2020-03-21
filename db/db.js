let mysql = require('mysql')

//set the configuration of our db
let config = {
    user : 'root',
    password : '',
    host : 'localhost',
    database : 'sfs'
}

//create connection to db
const db = mysql.createConnection(config)

//finally connect to the db
db.connect((err)=>{
    if(err){
        throw err
    }
    console.log("Database connected successfully !")
})

module.exports = db