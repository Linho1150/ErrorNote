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
//메인 페이지 요청이 들어왔을 때 json을 불러오고 로그인을 진행해서 쿠키가 있으면 nickname을
//render시 같이 전송하며 로그인을 안했으면 공백으로 전달

module.exports = router;
