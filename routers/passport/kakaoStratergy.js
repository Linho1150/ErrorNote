const { User } = require("../../models");
const KakaoStrategy = require("passport-kakao").Strategy;

module.exports = new KakaoStrategy(
  {
    clientID: process.env.KAKAO_ID,
    callbackURL: "/signin/kakao/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const exUser = await User.findOne({
        where: { snsId: profile.id },
      });
      if (exUser) {
        done(null, exUser);
      } else {
        const newUser = await User.create({
          snsId: profile.id,
          snsnickname: profile.username,
        });
        done(null, newUser);
      }
    } catch (error) {
      done(error);
    }
  }
);
/*카카오로그인 전략 카카오 로그인이 맞춰놓은 API 형식에 따라 요청한다 받은값은
redirect형식으로 다시 입력받고 입력받은 url을 통해 인증정보를 받고 해당 id가
이미 있으면 정보를 전달하여 로그인하고 없다면 새로운 정보를 DB에 저장하여 회원가입할 수 있도록한다.*/
