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
/* 현재까지 작성된 에러코드를 사용자에게 List ejs와 함께 모두 전달한다.
로그인되어있다면 nickname 정보를 같이 전달하고 아니면 공백으로 전달한다. */

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
});
/* id에 맞는 특정 게시물을 검색하여 데이터를 전달한다. 로그인 상태면 nickname을 함께 전달한다. */

module.exports = router;
