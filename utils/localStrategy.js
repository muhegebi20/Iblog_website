const passport = require("passport");
const localStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const User = require("../model/user");

passport.serializeUser(function (user, done) {
  return done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    let user = await User.findById(id);
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
});

passport.use(
  new localStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        let user = await User.findOne({ email });
        if (!user)
          return done(null, false, {
            message: "Incorrect username or password.",
          });
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, {
            message: "Incorrect username or password.",
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, false, { message: "something went wrong!." });
      }
    }
  )
);

module.exports = passport;
