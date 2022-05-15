'use static';
const express = require('express');
const path=require('path');
const dotenv = require('dotenv');
const morgan=require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');


const app = express();

const indexRouter = require('./routers/index');
const writeRouter = require('./routers/write');
const loginRouter = require('./routers/login');


dotenv.config();

app.set('view engine', 'ejs');
app.set('views', './views');
app.set('port',process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:process.env.COOKIE_SECRET,
    cookie:{
        httpOnly:true,
        secure:false,
    },
    name:'session-cookie',
}));

app.use('/',indexRouter);
app.use('/write',writeRouter);
app.use('/login',loginRouter);

app.use((req,res,next)=>{
    res.status(404).send(`${req.method} ${req.path} is NOT FOUND`);
});
app.use((err,req,res,next)=>{
    console.error(err);
    res.send("Server Error");
});

app.listen(app.get('port'),()=>{
});