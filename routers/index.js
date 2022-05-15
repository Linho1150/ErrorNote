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
//메인 페이지 요청이 들어왔을 때 json을 불러오고 로그인을 진행해서 쿠키가 있으면 nickname을
//render시 같이 전송하며 로그인을 안했으면 공백으로 전달

router.delete('/:id',async(req,res)=>{
    const data=JSON.parse(await fs.readFile('./public/json/data.json','utf8'));
    data.arr.splice(req.params.id, 1);
    await fs.writeFile('./public/json/data.json',JSON.stringify(data));
    return res.render('index',{nickname:"",readData:data});
});
//제거 버튼 클릭시 params로 입력받은 값에 해당하는 데이터 제거
//먼저 기존의 데이터 정보를 가져오고 splice를 통해서 값을 통째로 제거
//제거한 파일을 다시 저장하고 render를 통해서 정보 반영

module.exports=router;