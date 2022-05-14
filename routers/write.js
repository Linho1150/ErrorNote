const express=require('express');
const router=express.Router();
const path=require('path');
const multer = require('multer');

const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'uploads/');
    },
    filename:function (req,file,cb){
        const ext = path.extname(file.originalname);
        cb(null,path.basename(file.originalname,ext)+Date.now()+ext);
    },
});

const upload = multer({
    storage:storage,
});

router.get('/',(req,res,next)=>{
    const nickname=req.session.nickname;
    if(nickname)
        return res.render('write',{nickname:nickname+" "});
    else
        return res.redirect('/');
})

router.post('/',upload.fields([{name:'errfile',maxCount:1},{name:'solfile',maxCount:1}]),(req,res,next)=>{
    const nickname=req.session.nickname;
    console.log(req.body);
    console.log(req.files);
    console.log(req);
    const {language,problem,solution}=req.body
    return res.redirect('/');
});

module.exports=router;


//errfile
//solfile