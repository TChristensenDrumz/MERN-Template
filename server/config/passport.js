const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/schemas/user");

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;
