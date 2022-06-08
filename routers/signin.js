const express = require("express");
const router = express.Router();
const passport = require("./passport/index");
const { isLoggedIn, isNotLoggedIn } = require("./isLogin");

router.get("/", isNotLoggedIn, (req, res, next) => {
  return res.render("signin", { nickname: "" });
});
//로그인 페이지 불러오기. 이미 로그인하여 nickname이 있으면 제한

router.get("/logout", (req, res) => {
  req.session.nickname = undefined;
  return res.redirect("/");
});
//로그아웃을 시도하면 쿠키를 지워서 로그아웃 하고 메인페이지로 이동

/* Passport Login */
/* Local-Strategy를 이용해서 사용자 인증 요청 처리 */
router.post("/", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      return next(authError);
    }
    if (!user) {
      return res.json(false);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }
      return res.json(true);
    });
  })(req, res, next);
});

// kakao site login
router.get("/kakao", passport.authenticate("kakao"));

// kakao site login후 자동 redirect
// kakao 계정 정보를 이용하여 login or 회원가입/login
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/signin",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

router.get("/logout", async (req, res) => {
  req.session.destroy(function (err) {
    req.logout();
    delete req.user;
    req.user = null;
    console.log("asf");
    res.redirect("/");
  });
});

module.exports = router;
