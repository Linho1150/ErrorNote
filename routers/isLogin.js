// isLoggedIn 함수
// 로그인된 상태이면 다음 미들웨어로 연결
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).render("error");
  }
};

// isNotLoggedIn 함수
// 로그인 안된 상태이면 다음 미들웨어로 연결
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect(`/signin`);
  }
};
