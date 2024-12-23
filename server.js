const express = require('express');
const mysql = require('mysql');
const db = require('./models/database');
const http = require('http');

const fileUpload = require('express-fileupload');
const nodemailer = require('nodemailer');
const session = require('express-session');
const path = require('path');
const mysqlStore = require('express-mysql-session')(session);
require("dotenv").config({ path: './.env' });
const PORT= process.env.APP_PORT;
const app=express();
const server=http.createServer(app);
app.set('view engine','ejs');
app.use(fileUpload());
server.listen(PORT,()=>{console.log("connected")});
const options ={
    connectionLimit: 10,
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.MYSQL_DB,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    createDatabaseTable: true
}
const TWO_HOURS = 1000 * 60 * 60 * 2
const pool = mysql.createPool(options);
const  sessionStore = new mysqlStore(options, pool);
app.use(express.static(path.join(__dirname,'/public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: process.env.SESS_SECRET,
    cookie: {
        maxAge: TWO_HOURS,
        sameSite: true
    }
}))
const methodOverride = require('method-override');
app.use(methodOverride('_method'))
const famillyRoutes = require('./routes/famillyRoutes');
const lifeTimeRoutes = require('./routes/lifeTimeRoutes');
const eventRoutes = require('./routes/eventRoutes');
const eventDetailsRoutes = require('./routes/eventDetailsRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const memoriesRoutes = require('./routes/memoriesRoutes');
const profileRoutes = require('./routes/profileRoutes');
app.use('/familly', famillyRoutes);
app.use('/event', eventRoutes);
app.use('/eventDetails', eventDetailsRoutes);
app.use('/services', servicesRoutes);
app.use('/memories', memoriesRoutes);
app.use('/lifeTime', lifeTimeRoutes);
app.use('/profile',profileRoutes);
app.get('/',(req, res) => {
    req.session.msg1="";
    res.render('index', { session: req.session });
});
app.get('/index',(req, res) => {
    
    res.render('index', { session: req.session });
});
app.post('/index',async (req, res) => {
    let c=0;
    let PuserId="",Pguest="";
    let given=req.body.given;
    for(let i=0;i<given.length;i++)
    {
        if(given[i]==='B'&&c<2)c++;
        else if(c===0)
        {
            Pguest+=given[i];
        }
        else if(c===1)PuserId+=given[i];

    }
    PuserId=parseInt(PuserId);
    Pguest=parseInt(Pguest);
    req.session.userId = PuserId;
    let f=await db.getUser(PuserId);
    req.session.firstName =f.firstName;
    req.session.guest = Pguest;
    req.session.aA=undefined
    req.session.bB=undefined
    req.session.cC=undefined
    req.session.dD=undefined
    let t=await db.getgiven(PuserId,Pguest);
    for(let i=0;i<t.length;i++){
        if(t[i].authFk===2)req.session.aA=1;
        else if(t[i].authFk===1)req.session.bB=1;
        else if(t[i].authFk===3)req.session.cC=1;
        else if(t[i].authFk===4)req.session.dD=1;
      } 
      
    res.render('index', { session: req.session })
});
var firstName ;
var lastName;
var email;
var password;
app.get('/verify-email',async (req,res)=>{
    if(req.query.token=="1411")
    {
         await db.insertUser(firstName, lastName, email, password)
    .then((user)=>{
        
        if(user.userId)
        {
        req.session.userId = user.userId;
        req.session.firstName = user.firstName;
        }
        else 
        {
            req.session.msg=user;
        }
        });
    return res.render('index', { session: req.session })
    }
   
})
app.post('/',async (req, res) => {
    req.session.msg1="";
    if (req.body.logout) {
        let read=await db.checkauth(400,req.session.userId,2);
          if(read===1)
          {
          let any = await db.deleteauth(req.session.userId);
          }
     req.session.destroy( async err => {
         if(err){
            req.session.msg4="!! An error occured reload and try again ";
            return res.render('index', { session: req.session }); 
         }
         sessionStore.close()
          res.clearCookie(process.env.SESS_NAME)
        
         res.redirect("/")
        });  
     }
     else if (req.body.login) {
         try{ 
             const email = req.body.email;
             let password = req.body.password;
             user = await db.getUserByEmail(email);
              
             if(!user){
                req.session.msg="!! Enter a valid email";
                return res.render('index', { session: req.session });
             }
             if(user.userPassword !== password){
                req.session.msg="!! Incorrect password";
                return res.render('index', { session: req.session });
              
             }
                  
                 req.session.userId = user.userId
                 req.session.firstName=user.firstName
                 if(req.session.guest===undefined)
                 {
                    req.session.aA=1
                 req.session.bB=1
                 req.session.cC=1
                 req.session.dD=undefined
                 if(user.userId===400)req.session.dD=1
                 req.session.guest=undefined
                }
                 req.session.msg1="";
                 let read=await db.checkauth(400,req.session.userId,2)
                 if(read===0)
                 {
                    let any = await db.insertauth(400,req.session.userId,2);
                 }
                 return res.render('index', { session: req.session })
             
          
             } catch(e){
                req.session.msg="!! An error occured reload and try again ";
                return res.render('index', { session: req.session }); 
             }
     }
     else if (req.body.signup) {
         try {
              firstName = req.body.firstName;
              lastName = req.body.lastName;
              email = req.body.email;
              password = req.body.password;
              req.session.guest=undefined
                 req.session.aA=1
                 req.session.bB=1
                 req.session.cC=1
                 req.session.dD=undefined
                 req.session.msg1=""
              if(!email)
              {
                req.session.msg="!! Email must has value";
                return res.render('index', { session: req.session });
              }
              else if(!password)
              {
                req.session.msg="!! Password must has value";
                return res.render('index', { session: req.session });
              }
              else if(!firstName)
              {
                req.session.msg="!! Name must has value";
                return res.render('index', { session: req.session });
              }
             else 
             {
                var sent=VerifyEmail(email,"1411");
                if(sent===0)
                {
                    req.session.msg1="Please open the email to verify that it is you";
                    let any = await db.insertauth(400,req.session.userId,2);
                    return res.render('index/verify-email', { session: req.session }); 
                }
                else 
                {
                    req.session.msg1="Please check your email setting we cant send you a verfication email";
                    return res.render('index', { session: req.session }); 
                }
            }
         } catch (e) {
            req.session.msg1="!! An error occured reload and try again ";
            return res.render('index', { session: req.session }); 
         }
     }
 })
function VerifyEmail(email,token)
{
    var email=email;
    var token=token;
    var mail=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user: 'he84tt@gmail.com',
            pass: 'pbvmrwuhfaujomgz'
        }
    });
    var mailOptions={
        from:'MyArchive',
        to:email,
        subject:'Email Vervication',
        html: '<p>You requested for email verification, kindly use this <a href="http://localhost:3000/verify-email?token=' + token + '">link</a> to verify your email address</p>'
    };
    mail.sendMail(mailOptions,(error,info)=>{
        if(error)
        {
            return 1;
        }
        else return 0;
    });
}
//routes 

