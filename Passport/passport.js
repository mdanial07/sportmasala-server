const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const { User } = require('../Schema/Users');
const { SECRET_TOKEN } = require('../config');


// Setup Options for Jwt strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: SECRET_TOKEN,
};

// create jwt strategy for user authentication
passport.use('jwt', new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.sub, (err, user) => {
    if (err) {
      return done(err, false);
    }

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  });
}));

exports.requireAuth = passport.authenticate('jwt', { session: false });
