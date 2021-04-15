const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");

const app = express();
app.use(bodyParser.json());
let auth = require("./auth")(app); // 'app' here ensures express is available in auth.js file.
const passport = require("passport");
require("./passport");
const cors = require("cors");
app.use(cors());
const { check, validationResult } = require("express-validator");
morgan = require("morgan");
const mongoose = require("mongoose");
const Models = require("./models.js");
const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(morgan("common"));
app.use(express.static("public")); // if in this have multiple files, it can be accessed via the file name, like test.html after path
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Get all users
app.get("/users", (req, res) => {
  Users.find()
    .then(users => {
      res.status(201).json(users);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get all movies
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then(movies => {
        res.status(201).json(movies);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Get a user by username
app.get("/users/:username", (req, res) => {
  Users.findOne({ Username: req.params.username })
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// GET requests
app.get("/", (req, res) => {
  res.send("Welcome to my MyFlix app!");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

// Return a list of ALL movies to the user
app.get("/movies", (req, res) => {
  res.json(movies);
});

// Return data (genre, director, release year) about a single movie by title to the user
app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.title })
      .then(movie => {
        res.status(201).json(movie);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get(
  "/movies/genre/:name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.name })
      .then(genre => {
        res.status(201).json(genre.Genre);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Return data about a director (bio, birth year, death year) by name
app.get(
  "/movies/director/:name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.name })
      .then(director => {
        res.status(201).json(director.Director);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Allow new users to register
app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 3 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed"
    ).isAlphanumeric(),
    check("Password", "Password is required")
      .not()
      .isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail()
  ],
  (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      //If errors not empty
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.username })
      .then(user => {
        if (user) {
          return res.status(400).send(req.body.username + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
            .then(user => {
              res.status(201).json(user);
            })
            .catch(error => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch(error => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Allow users to add a movie to their list of favorites
app.post(
  "/users/:username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.username },
      {
        $push: { FavoriteMovies: req.params.MovieID }
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Allow users to update their user info
app.put(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  [
    check("Username", "Username is required").isLength({ min: 3 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed"
    ).isAlphanumeric(),
    check("Password", "Password is required")
      .not()
      .isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail()
  ],
  (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      //If errors not empty
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
      { Username: req.params.username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Allow users to remove a movie from their list of favorites
app.delete(
  "/users/:username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndDelete({ Username: req.params.username })
      .then(movieid => {
        if (!movieid) {
          res.status(400).send(req.params.MovieID + " was not found");
        } else {
          res.status(200).send(req.params.MovieID + " was deleted.");
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);
// Users.findOneAndUpdate(
//       { Username: req.params.username },
//       {
//         $pull: { FavoriteMovies: req.params.MovieID }
//       },
//       { new: true }, // This line makes sure that the updated document is returned
//       (err, updatedUser) => {
//         if (err) {
//           console.error(err);
//           res.status(500).send("Error: " + err);
//         } else {
//           res.json(
//             `${req.params.MovieID} has been removed from user's favorite movies.`
//           );
//         }
//       }
//     );
//   }
// );

// Allow existing users to deregister
// Delete a user by username
app.delete("/users/:username", (req, res) => {
  Users.findOneAndRemove({ Username: req.params.username })
    .then(user => {
      if (!user) {
        res.status(400).send(req.params.username + " was not found");
      } else {
        res.status(200).send(req.params.username + " was deleted.");
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// listen for requests
// app.listen(8080, () => {
//   console.log("Your app is listening on port 8080.");
// });
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
