const express = require('express')
let cors = require('cors')
let app = express()
let port = 3000

app.locals.baseURL = "http://localhost:3000"
app.use(cors())
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

app.use(cookieParser())

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000000 }
    
}));
//set tepmlate engine
app.set('view engine', 'ejs')

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded());
 //parse type application/json

//require our db module
let db = require('./db/db')

//set our db to be used globally
global.db = db
global.cropsBackup = []

//require our router
const router = require('./routes/routes')

// //use our router
app.use(router)

//set the path to static files
app.use(express.static(__dirname+'/public/'))


app.listen(port,()=>{
  console.log("Started server")
})