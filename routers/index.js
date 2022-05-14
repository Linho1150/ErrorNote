const express=require('express');
const router=express.Router();
const path=require('path');

router.get('/',(req,res,next)=>{
    const nickname=req.session.nickname;
    if(nickname)
        return res.render('index',{nickname:nickname+" "});
    else
        return res.render('index',{nickname:""});
})

module.exports=router;