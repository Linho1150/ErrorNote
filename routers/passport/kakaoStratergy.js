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
