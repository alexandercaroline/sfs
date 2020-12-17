const express = require('express')
let cors = require('cors')
let app = express()
let port = 3000
const path = require('path')
const socketIO = require('socket.io')
const bodyParser = require('body-parser')
//require our router
const router = require('./routes/routes')
app.locals.baseURL = "http://localhost:3000"

let cookieParser  = require('cookie-parser') 
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
 
var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'sfs'
};
 
var sessionStore = new MySQLStore(options)

app.use(cors()).use(cookieParser()).use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000000 }
    
}))
//set tepmlate engine
.set('view engine', 'ejs')
.use(bodyParser.json())
.use(bodyParser.urlencoded())
 //parse type application/json
// //use our router
.use(router)
//set the path to static files
.use(express.static(__dirname+'/public/'))
//require our db module


let db = require('./db/db')

//set our db to be used globally
global.db = db
global.cropsBackup = []
global.success = false;
app.listen(port,()=>{
  console.log("Started server")
})

