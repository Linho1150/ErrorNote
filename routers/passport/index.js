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

passport.use(localStrategy);
passport.use(kakaoStratergy);

module.exports = passport;
