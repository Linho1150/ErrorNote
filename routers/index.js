const express = require("express");
const { redirect } = require("express/lib/response");
const router = express.Router();
const path = require("path");
const ErrorInfo = require("../models/errorInfo");
const sequelize = require("sequelize");
const { isLoggedIn } = require("./isLogin");
const fs = require("fs").promises;

router.get("/", async (req, res, next) => {
  let countLanguage = [];
  const languages = await ErrorInfo.findAll({
    attributes: [
      "language",
      [sequelize.fn("count", sequelize.col("language")), "cnt"],
    ],
    group: ["language"],
  });
  languages.forEach((language) => {
    countLanguage.push({
      language: language["dataValues"].language,
      count: language["dataValues"].cnt,
    });
  });
  if (req.user) {
    const nickname = req.user.info.snsnickname;
    return res.render("index", { nickname: nickname, lanData: countLanguage });
  } else {
    return res.render("index", { nickname: "", lanData: countLanguage });
  }
});
/* 메인페이지에 게시글로 등록된 언어의 종류와 비중을 알려주기 위해 데이터를 가져오고
가져온 데이터를 lanData변수를 통해 전달한다. 또한 로그인되어있으면 nickname정보를 함께 전달한다.*/

module.exports = router;
