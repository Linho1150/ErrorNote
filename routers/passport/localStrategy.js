const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../../models/user");

module.exports = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      const exUser = await User.findOne({ where: { phoneNumber: email } });
      if (exUser) {
        const result = await bcrypt.compare(password, exUser.password);
        if (result) {
          done(null, exUser);
        } else {
          done(null, false, { message: "비밀번호가 일치하지 않습니다." });
        }
      } else {
        done(null, false, { message: "가입되지 않은 회원입니다." });
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }
);
/*로컬 인증 전략 기존에 bcrpt로 암호화된 정보를 불러와서 사용자가이번에 입력 비밀번호를
동일하게 bcrypt로 변경하여 동일한 값이 출력되는지 확인한다. 동일한 값이면 로그인 아니면 재로그인을 시도한다.*/
