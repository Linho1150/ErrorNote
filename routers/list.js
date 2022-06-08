const express = require("express");
const ErrorInfo = require("../models/errorInfo");
const router = express.Router();
const { isLoggedIn } = require("./isLogin");

router.get("/", async (req, res, next) => {
  let errorlist = [];
  const errors = await ErrorInfo.findAll();
  errors.forEach((error) => {
    errorlist.push(error["dataValues"]);
  });
  if (req.user) {
    const nickname = req.user.info.snsnickname;
    return res.render("list", { nickname: nickname, readData: errorlist });
  }
  return res.render("list", { nickname: "", readData: errorlist });
});
//메인 페이지 요청이 들어왔을 때 json을 불러오고 로그인을 진행해서 쿠키가 있으면 nickname을
//render시 같이 전송하며 로그인을 안했으면 공백으로 전달

router.get("/:id", async (req, res, next) => {
  const errorId = req.params.id;
  const reuslt = await ErrorInfo.findOne({ where: { errorId: errorId } });
  if (res.user) {
    const nickname = req.user.info.snsnickname;
    return res.render("viewer", {
      nickname: nickname + " ",
      readData: reuslt["dataValues"],
    });
  } else {
    return res.render("viewer", {
      nickname: " ",
      readData: reuslt["dataValues"],
    });
  }
  //뷰어 페이지, 게시글 하나에 대한 정보를 보여주는 페이지이다.
});

module.exports = router;
