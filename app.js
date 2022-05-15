'use static';
const express = require('express');
const path=require('path');
const dotenv = require('dotenv');
const morgan=require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
//각종 모듈을 연결하는 작업


const app = express();

const indexRouter = require('./routers/index');
const writeRouter = require('./routers/write');
const loginRouter = require('./routers/login');
//각종 라우터를 연결하는 작업


dotenv.config();

app.set('view engine', 'ejs'); //EJS 템플릿을 사용할 수 있도록 설정
app.set('views', './views'); //템플릿의 위치를 확인
app.set('port',process.env.PORT || 3000); //dotenv에서 port를 가져올수있도록 설정
app.use(morgan('dev')); //morgan을 dev모드로 설정
app.use(express.static(path.join(__dirname,'public'))); //public폴더를 외부에서도 접속할 수 있도록 설정
app.use(express.json()); //body parser용으로 설정
app.use(express.urlencoded({extended:false})); //urlencoded설정
app.use(cookieParser(process.env.COOKIE_SECRET)); //닉네임 정보를 저장해둘 cookie 설정
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:process.env.COOKIE_SECRET,
    cookie:{
        httpOnly:true,
        secure:false,
    },
    name:'session-cookie',
})); //세션 명과 세션의 세부정도에 대한 설정. 시크릿 키는 .env 파일에 저장

app.use('/',indexRouter);
app.use('/write',writeRouter);
app.use('/login',loginRouter);
//각종 라우터 연결

app.use((req,res,next)=>{
    res.status(404).send(`${req.method} ${req.path} is NOT FOUND`);
});
app.use((err,req,res,next)=>{
    console.error(err);
    res.send("Server Error");
});
// 404 오류 표시 및 각종 서버 오류 설정
app.listen(app.get('port'),()=>{
});
//포트 이름 설정