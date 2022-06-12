const passport = require("passport");
const User = require("../../models/user");
const kakaoStratergy = require("./kakaoStratergy");
const localStrategy = require("./localStrategy");

passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await User.findOne({ where: { userId: id } });
    console.log(result["dataValues"]);
    done(null, { info: result["dataValues"] });
  } catch (err) {
    done(err);
  }
});
//passport serializeUser를 통해 로그인마다 어떤 값을 req.user로 전달해줄지 결정

passport.use(localStrategy);
passport.use(kakaoStratergy);
//로컬전략과 카카오전략을 선택적으로 사용할 수 있도록 로드

module.exports = passport;
