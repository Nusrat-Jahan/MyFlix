const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String
  },
  Actors: [String],
  ImagePath: String,
  releaseYear: Number,
  imdbRating: Number,
  Featured: Boolean
});

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthdate: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }]
});

/**
 * Function to hash user password and that encrypted passwords are stored in the database
 * @param {string} password
 */
userSchema.statics.hashPassword = password => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Function to compare the hashed password in the database with the password that users enter
 * @param {string} password
 */
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};
let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);
module.exports.Movie = Movie;
module.exports.User = User;
