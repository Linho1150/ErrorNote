const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { isLoggedIn } = require("./isLogin");
const ErrorInfo = require("../models/errorInfo");
const fs = require("fs").promises;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
    //파일을 요청받았을때 파일을 저장할 위치를 설정
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
    //파일의 제목 형식을 지정
  },
});

const upload = multer({
  storage: storage,
  //위에서 지정한 관련 설정을 저장
});

router.get("/", isLoggedIn, (req, res, next) => {
  const nickname = req.user.info.snsnickname;
  return res.render("write", { nickname: nickname });
  //글쓰기 페이지를 요청하면 들어오는 API 쿠키에 Nickname이 저장되어있으면
  //로그인되었다고 가정하고 Nickname을 반환한다.
});

router.get("/:id", isLoggedIn, async (req, res, next) => {
  const errorId = req.params.id;
  const errorInfo = await ErrorInfo.findOne({ where: { errorId } });
  if (errorInfo["dataValues"].userId === String(req.user.info.userId)) {
    const nickname = req.user.info.snsnickname;
    return res.render("edit", {
      nickname: nickname,
      data: errorInfo["dataValues"],
    });
  }
  return res.redirect("/lists");
});

router.put(
  "/:id",
  isLoggedIn,
  upload.single("errorImg"),
  async (req, res, next) => {
    const errorId = req.params.id;
    const errorInfo = await ErrorInfo.findOne({ where: { errorId } });
    if (errorInfo["dataValues"].userId === String(req.user.info.userId)) {
      const { language, errorCode, problem, solution } = req.body;
      ErrorInfo.update(
        {
          language: language,
          errorcode: errorCode,
          problem: problem,
          solution: solution,
        },
        { where: { errorId } }
      );
      return res.redirect("/lists");
    }
  }
);

router.post(
  "/",
  isLoggedIn,
  upload.single("errorImg"),
  async (req, res, next) => {
    const { errorCode, language, problem, solution } = req.body;
    const result = await ErrorInfo.create({
      errorId: 0,
      errorImg: "uploads/" + req.file.filename,
      language: language,
      errorcode: errorCode,
      problem: problem,
      solution: solution,
      userId: req.user.info.userId,
    });
    return res.redirect("/lists");
  }
);
//form 태그에서 총 2가지의 파일을 요청하기 때문에 upload.fields로 입력을 받고
//두개의 파일 서버에 다운받는다. 이후 req.body에 함께 전달된내용을 json 파일에 저장하여
//데이터를 저장한다.

router.delete("/:id", isLoggedIn, async (req, res) => {
  const errorId = req.params.id;
  const errorInfo = await ErrorInfo.findOne({ where: { errorId } });
  console.log(errorInfo["dataValues"].userId);
  if (errorInfo["dataValues"].userId === String(req.user.info.userId)) {
    await ErrorInfo.destroy({ where: { errorId: errorId } });
    return res.json(true);
  }
  return res.json(false);
});
//제거 버튼 클릭시 params로 입력받은 값에 해당하는 데이터 제거
module.exports = router;
