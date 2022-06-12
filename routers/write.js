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
});

//글쓰기 페이지를 요청하면 들어오는 API
//로그인 되어있지 않으면 진행할 수 없다.

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
//수정페이지를 요청했을떄 기존의 정보를 사용자에게 제공할 수 있도록
//수정페이지와 동시에 기존의 정보를 함께 전달하여 출력한다.

router.put(
  "/:id",
  isLoggedIn,
  upload.single("errorImg"),
  async (req, res, next) => {
    const errorId = req.params.id;
    const errorInfo = await ErrorInfo.findOne({ where: { errorId } });

    if (errorInfo["dataValues"].userId == String(req.user.info.userId)) {
      const { language, errorcode, problem, solution, errorId } = req.body;
      ErrorInfo.update(
        {
          language: language,
          errorcode: errorcode,
          problem: problem,
          solution: solution,
          errorId: errorId,
        },
        { where: { errorId } }
      );
      return res.redirect("/lists");
    }
  }
);

/* 수정을 요청하면 해당 정보를 바탕으로 업데이트 할 수 있도록 한다.
다른 사용자가 요청했을때는 업데이트를 진행하지 못하도록 한다. */

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
//upload.fields로 에러코드 이미지를 전달받고 파일을 서버의 uploads폴더에 다운받는다.
//저장한 경로와 입력받은 각종 데이터를 토대로 DB에 저장할 수 있도록 한다.

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
//제거 버튼 클릭시 params로 입력받은 값에 해당하는 데이터 제거한다.
module.exports = router;
