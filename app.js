const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
var PORT = process.env.PORT || 8080;
const mysql = require('mysql');
const path = require('path');
const app = express();
//var env = require('dotenv').load();

const {userLogin,isLogedIn,getHomePage,userlogOut} = require('./routes/index');
const {addPersonPage,addPerson,addContactPage,addContact,addDemographicsPage,addDemographics,addAddressPage,addAddress,editPersonPage,editPerson,personList} = require('./routes/person')
const port = 2000;


//create connection to database
//the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const connection = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'dev_trapo'
});
connection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.connection = connection;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));//May want to set this to true after more research
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload
app.use(session({secret: 'keyboard cat',resave: false,saveUninitialized: true,cookie:{maxAge:60000}}));//session secret

// routes for the app
app.get('/login',userLogin);
app.get('/logout',userlogOut);
app.get('/', isLogedIn, getHomePage);
app.get('/personList',isLogedIn,personList);
app.get('/addPerson', isLogedIn,addPersonPage);
app.get('/editPerson/:personid', editPersonPage);
app.get('/addContact/:personid/:name',addContactPage);
app.get('/addAddress/:personid/:name', addAddressPage);
app.get('/addDemographics/:personid/:name',addDemographicsPage);
//app.get('/addperson',addClientPage);
app.post('/login',userLogin);
app.post('/addPerson', addPerson);
app.post('/addContact',addContact);
app.post('/addAddress',addAddress);
app.post('/addDemographics',addDemographics);
app.post('/editPerson/:personid', editPerson);


//set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});