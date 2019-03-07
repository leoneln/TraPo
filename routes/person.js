//const fs = require('fs');

module.exports = {
    addPersonPage: (req, res) => {
        let userLoggedIn = req.session.user;
        let idLoggedIn = req.session.userId;
        res.render('add-person.ejs', {
            userLoggedIn,
            idLoggedIn,
            title: 'Trapo | Add Person'
            ,message: ''
        });
    },addPerson: (req, res) => {
        let userLoggedIn = req.session.user;
        let idLoggedIn = req.session.userId;
        let message = '';
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let dob = req.body.dob;
        let gender = req.body.gender;
        let validated = req.body.validated;
        let newPerson = [firstname,lastname,dob,gender,idLoggedIn];

        let d = new Date(dob);
        let year = d.getUTCFullYear();
        let month = d.getUTCMonth()+1;
        let day = d.getUTCDate();

        //Define insert query here
        let insertQuery = "INSERT INTO person(persontype,firstname,lastname,dob,gender,addedby,modifiedby) VALUES"+ 
                    "('client','"+firstname+"','"+lastname+"','"+dob+"','"+gender+"',"+idLoggedIn+","+idLoggedIn+")";

        let duplicateQuery = "SELECT personid,firstname,lastname,date_format(dob,'%m/%d/%Y')as birthDate,gender "+
          "FROM person "+
          "WHERE persontype = 'client' AND ((firstname = '"+firstname+"' OR lastname = '"+lastname+"') AND (year(dob) = '"+year+"' OR month(dob) = '"+month+"' OR day(dob) = '"+day+"')) "+
          "OR (firstname = '"+firstname+"' AND lastname = '"+lastname+"' AND (year(dob) = '"+year+"' OR month(dob) = '"+month+"' or day(dob) = '"+day+"'))";

          connection.query(duplicateQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0 && validated === "0") {
                //If query returns results then go to duplicate check page
                message = 'Possible duplicate(s) found in TraPO!';
                return res.render('duplicate.ejs',{
                    userLoggedIn,
                    idLoggedIn,
                    message,
                    title: "TraPO | Duplicates",
                    result, newPerson
                });
            } else {
                connection.query(insertQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect(`/addContact/${result.insertId}/${firstname}`);
                });
            }
        });
    },addContactPage: (req,res) => {
        let userLoggedIn = req.session.user;
        let idLoggedIn = req.session.userId;
        let personid =  req.params.personid;
        let personname = req.params.name;
        let message = "Sweet, now lets add contact information for "+personname;
        res.render('add-contact.ejs', {
            userLoggedIn,idLoggedIn,
            title: 'Trapo | Person Contact'
            ,message
            ,personid
            ,personname
        });
    },addContact: (req,res) => {
        let message = '';
        let userLoggedIn = req.session.user;
        let idLoggedIn = req.session.userId;
        let primcontact = req.body.primcontact;
        let primcarrier = req.body.primcarrier;
        let emercontact = req.body.emercontact;
        let email = req.body.email;
        let addedby = req.body.addedby;
        let personid = req.body.personid;
        let personname = req.body.personname;

        let addContQry = `INSERT INTO contact(personid,primcontact,primcarrier,emercontact,email,addedby) VALUES`+ 
        `(${personid},'${primcontact}','${primcarrier}','${emercontact}','${email}',${idLoggedIn})`;

        connection.query(addContQry,(err,result) =>{
            if(err) {
                return res.status(500).send(err);
            }
            res.redirect(`/addAddress/${personid}/${personname}`);
        });
    },addAddressPage: (req,res) => {
        let userLoggedIn = req.session.user;
        let idLoggedIn = req.session.userId;
        let personid =  req.params.personid;
        let personname = req.params.name;
        let message = "Great, now lets an address for "+personname;
        res.render('add-address.ejs', {
            userLoggedIn,idLoggedIn,
            title: 'Trapo | Address'
            ,message
            ,personid
            ,personname
        });
    },addAddress: (req,res) => {
        let message = '';
        let userLoggedIn = req.session.user;
        let idLoggedIn = req.session.userId;
        let address1 = req.body.address1;
        let address2 = req.body.address2;
        let duelingtype = req.body.duelingtype;
        let owned = req.body.owned;
        let city = req.body.city;
        let zip = req.body.zip;
        let state = req.body.state;
        let personid = req.body.personid;
        let personname = req.body.personname;

        let addContQry = `INSERT INTO address(personid,address1,address2,duelingtype,owned,city,zip,state,addedby) VALUES`+ 
        `(${personid},'${address1}','${address2}','${duelingtype}','${owned}','${city}','${zip}','${state}',${idLoggedIn})`;

        connection.query(addContQry,(err,result) =>{
            if(err) {
                return res.status(500).send(err);
            }
            res.redirect(`/addDemographics/${personid}/${personname}`);
        });
    },addDemographicsPage: (req,res) => {
        let userLoggedIn = req.session.user;
        let idLoggedIn = req.session.userId;
        let personid =  req.params.personid;
        let personname = req.params.name;
        let message = "Almost there, now lets add demographic information for "+personname;
        res.render('add-demographics.ejs', {
            userLoggedIn,idLoggedIn,
            title: 'Trapo | Person Demographics'
            ,message
            ,personid
            ,personname
        });
    },addDemographics: (req,res) => {
        let message = '';
        let userLoggedIn = req.session.user;
        let idLoggedIn = req.session.userId;
        let personid = req.body.personid;
        let origincountry = req.body.origincountry;
        let languagehome = req.body.languagehome;
        let engproficiency = req.body.engproficiency;
        let lenusresidence = req.body.lenusresidence;
        let employed = req.body.employed;
        let emptype = req.body.emptype;
        let empsector = req.body.empsector;
        let hhsize = req.body.hhsize;
        let dependants = req.body.dependants;
        let maritalstatus = req.body.maritalstatus;
        let hhincome = req.body.hhincome;
        let ethnicity = req.body.ethnicity;

        let addDemQry = `INSERT INTO demographics(personid,origincountry,languagehome,engproficiency,lenusresidence,employed,emptype,empsector,hhsize,dependants,maritalstatus,hhincome,ethnicity,addedby) VALUES`+ 
        `(${personid},'${origincountry}','${languagehome}','${engproficiency}',${lenusresidence},'${employed}','${emptype}','${empsector}',${hhsize},${dependants},'${maritalstatus}','${hhincome}','${ethnicity}',${idLoggedIn})`;
        connection.query(addDemQry,(err,result) =>{
            if(err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });

    },editPersonPage: (req, res) => {
        let userLoggedIn = req.session.user;
        let idLoggedIn = req.session.userId;
        let personid = req.params.personid;
        let editQuery = "SELECT p.firstname,p.lastname,date_format(p.dob,'%Y-%m-%d')as dob,p.gender,concat(a.firstname,' ',a.lastname)as addedby,date_format(p.dateadded,'%m/%d/%Y')as dateadded "+
        "FROM person p join person a on p.addedby = a.personid "+
        "WHERE p.personid = "+personid;
        connection.query(editQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-person.ejs', {
                userLoggedIn,idLoggedIn,
                title: "TraPO | Edit Person"
                ,person: result[0]
                ,message: ''
            });
        });
    },
    editPerson: (req, res) => {
        let userLoggedIn = req.session.user;
        let idLoggedIn = req.session.userId;
        let personid = req.params.personid;
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let dob = req.body.dob;
        let gender = req.body.gender;

        let query = "UPDATE person SET firstname = '" + firstname + "', lastname = '" + lastname + "', dob = '" + dob + "', gender = '" + gender + "',modifiedby = '"+idLoggedIn+"' WHERE personid = " + personid;
        connection.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    }
    ,personList: (req, res) => {
        let userLoggedIn = req.session.user;
        let idLoggedIn = req.session.userId;
        let query = "SELECT * FROM personlist ORDER BY lastname"; // query database to get all the players
        // execute query
        connection.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('person-list.ejs', {
                userLoggedIn,idLoggedIn,
                title: "TraPO | People"
                ,persons: result
            });
        });
    },
};