
module.exports = {
    userLogin: (req,res) => {
        let message = '';
        let sess = req.session;
        if(req.method == 'POST'){
            let post = req.body;
            let username = post.username;
            let pass = post.password;
            
            let sql = `SELECT u.personid, CONCAT(p.firstname ,' ',p.lastname) as name, u.username, u.password, u.accesslevel 
            FROM users u JOIN person p on u.personid = p.personid
            WHERE username = '${username}' LIMIT 1;`

            connection.query(sql,(err,result) => {
                if(err){
                    message = 'Please try again';
                    res.render('login.ejs',{message: message});
                } else if (result.length && result[0].username == username && result[0].password == pass){
                    req.session.userId = result[0].personid;
                    req.session.user = result[0].name;
                    res.redirect('/');
                 }else{
                    message = 'Wrong Credentials';
                    res.render('login.ejs',{message: message});
                 }
            });
        } else {
            res.render('login.ejs',{message: message});
        }    
    },
    isLogedIn: (req,res,next) => {
        if(req.session.userId && req.session.user){
            next();
        } else {
            res.redirect('/login');
        }
    },
    getHomePage: (req, res) => {
        let userLoggedIn = req.session.user;
        let idLoggedIn = req.session.userId;
        res.render('index.ejs', {
                userLoggedIn,
                idLoggedIn,
                title: "TraPO | List"
            });
    },userlogOut: (req,res) => {
        if(req.session) {
            req.session.destroy(function(err){
                if(err){
                    return next(err);
                }else {
                    return res.redirect('/');
                }
            })
        }
    }
};