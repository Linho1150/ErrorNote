const express=require('express');
const { redirect } = require('express/lib/response');
const router=express.Router();
const path=require('path');
const fs=require('fs').promises;

router.get('/',async (req,res,next)=>{
    const nickname=req.session.nickname;
    const data=JSON.parse(await fs.readFile('./public/json/data.json','utf8'));
    
    if(nickname)
        return res.render('index',{nickname:nickname+" ",readData:data});
    else
        return res.render('index',{nickname:"",readData:data});
})

router.delete('/:id',async(req,res)=>{
    const data=JSON.parse(await fs.readFile('./public/json/data.json','utf8'));
    data.arr.splice(req.params.id, 1);
    await fs.writeFile('./public/json/data.json',JSON.stringify(data));
    return res.render('index',{nickname:"",readData:data});
});

module.exports=router;