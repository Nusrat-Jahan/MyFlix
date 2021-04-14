const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models.js"),
  passportJWT = require("passport-JWT");

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: "Username",
      passwordField: "Password"
    },
    (username, password, callback) => {
      //When Passport authenticates a request, it parses the credentials contained in the request. It then invokes the verify callback with those credentials as arguments, in this case username and password. If the credentials are valid, the verify callback invokes 'callback' to supply Passport with the user that authenticated.
      console.log(username + " " + password);
      Users.findOne({ Username: username }, (error, user) => {
        if (error) {
          // , if an exception occurred while verifying the credentials (for example, if the database is not available)
          console.log(error);
          return callback(error);
        }
        if (!user) {
          console.log("Incorrect Username");
          return callback(null, false, {
            message: "Incorrect Username or Password"
          }); //If the credentials are not valid (for example, if the password is incorrect), 'callback' should be invoked with false and give user a message to indicate an authentication failure
        }
        console.log("Finished");
        return callback(null, user); //If the credentials are valid, the verify 'callback' invokes to supply Passport with the user that authenticated.
      });
    }
  )
);
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret"
    },
    (jwtPayload, callback) => {
      return Users.findById(jwtPayload._id)
        .then(user => {
          return callback(null, user);
        })
        .catch(error => {
          return callback(error);
        });
    }
  )
);
