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

router.get('/logout',(req,res)=>{
    req.session.nickname=undefined;
    return res.redirect('/');
});

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

module.exports=router;