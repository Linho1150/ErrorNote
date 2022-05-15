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
    //수정페이지를 요청하면 반환한다. 요청한 페이지의 값을 json 데이터에서 추출한 후
    //수정페이지에서 html을 세팅하여 바로 수정할 수 있도록 함.
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
//수정을 요청하면 기존의 데이터를 미리 저장해두고
//수정 요청한 데이터를 json 에서 제거하한다
//제거하고 수정된 데이터를 다시 불러와서
//제거하기 이전에 데이터중 필요한 데이터를 선별적으로 수정된 데이터와 병합하여
//다시 Json 파일에 저장하고 메인페이지를 호출한다.

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
//form 태그에서 총 2가지의 파일을 요청하기 때문에 upload.fields로 입력을 받고
//두개의 파일 서버에 다운받는다. 이후 req.body에 함께 전달된내용을 json 파일에 저장하여
//데이터를 저장한다.

module.exports=router;