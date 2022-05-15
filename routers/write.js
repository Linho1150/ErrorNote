const express=require('express');
const router=express.Router();
const path=require('path');
const multer = require('multer');
const fs = require('fs').promises;

const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'public/uploads/');
        //파일을 요청받았을때 파일을 저장할 위치를 설정
    },
    filename:function (req,file,cb){
        const ext = path.extname(file.originalname);
        cb(null,Date.now()+ext);
        //파일의 제목 형식을 지정
    },
});

const upload = multer({
    storage:storage,
    //위에서 지정한 관련 설정을 저장
});


router.get('/',(req,res,next)=>{
    const nickname=req.session.nickname;
    if(nickname)
        return res.render('write',{nickname:nickname+" "});
    else
        return res.redirect('/');
    //글쓰기 페이지를 요청하면 들어오는 API 쿠키에 Nickname이 저장되어있으면
    //로그인되었다고 가정하고 Nickname을 반환한다.
})

router.get('/:id',async (req,res,next)=>{
    const cnt = req.params.id;
    const nickname=req.session.nickname;
    if(nickname){
        const data=JSON.parse(await fs.readFile('./public/json/data.json','utf8'));
        console.log(data.arr[cnt]);
        return res.render('edit',{nickname:nickname+" ",readData:data.arr[cnt],cnt:cnt});
    }
    else
    {
        return res.redirect('/');
    }
    //수정페이지를 요청하면 반환한다. 
})

router.put('/:id',async (req,res,next)=>{
    const cnt = req.params.id;
    const read=JSON.parse(await fs.readFile('./public/json/data.json','utf8'));
    const errfile=read.errfile;
    const solfile=read.solfile;

    read.arr.splice(cnt, 1);
    const {errorCode,language,problem,solution}=req.body
    const result={
        errorCode,
        language,
        problem,
        solution,
        errfile,
        solfile,
    }
    read.arr.push(result);
    await fs.writeFile('./public/json/data.json',JSON.stringify(read));
    return res.redirect('/');
})

router.post('/',upload.fields([{name:'errfile'},{name:'solfile'}]),async (req,res,next)=>{
    const {errorCode,language,problem,solution}=req.body
    const result={
        errorCode,
        language,
        problem,
        solution,
        errfile:'uploads/'+req.files.errfile[0].filename,
        solfile:'uploads/'+req.files.solfile[0].filename,
    }
    const data=JSON.parse(await fs.readFile('./public/json/data.json','utf8'));
    data.arr.push(result);

    await fs.writeFile('./public/json/data.json',JSON.stringify(data));
    return res.redirect('/');
});

module.exports=router;

//errfile
//solfile