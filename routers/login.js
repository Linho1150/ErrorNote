const express=require('express');
const router=express.Router();
const path=require('path');

router.get('/',(req,res,next)=>{
    const nickname=req.session.nickname;
    if(nickname){
        return res.redirect('/');
    }
    return res.render('login',{nickname:nickname+" "});
});
//로그인 페이지 불러오기. 이미 로그인하여 nickname이 있으면 제한

router.get('/logout',(req,res)=>{
    req.session.nickname=undefined;
    return res.redirect('/');
});
//로그아웃을 시도하면 쿠키를 지워서 로그아웃 하고 메인페이지로 이동

router.post('/admit',(req,res)=>{
    const { id, password } = req.body;
    if(id=='Guest' && password == '7777'){
        req.session.nickname=id;
        res.cookie('admin',true,{
            expires:new Date(Date.now()+3000),
            httpOnly: true,
            secure: false,
            path:'/',
            signed:true,
        });
        res.redirect('/');
    } else{
        res.redirect('/login');
    }
});
//로그인을 시도하여 전달 받은 내용이 GUEST / 7777 이면 로그인 성공
//로그인을 성공하면 입력받은 id 값을 쿠키에 저장
//expires와 같은 쿠키와 관련된 정보를 준 후에
//로그인하면 메인페이지로 이동 틀리면 로그인 페이지를 다시 로드

module.exports=router;