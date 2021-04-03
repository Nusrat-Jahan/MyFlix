const express = require("express");
morgan = require("morgan");
const app = express();

app.use(morgan("common"));
app.use(express.static("public")); // if in this have multiple files, it can be accessed via the file name, like test.html after path
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

let movies = [
  {
    title: "The Shawshank Redemption",
    director: "Frank Darabont",
    genre: "Drama",
    releaseYear: "1994",
    imdbRating: "9.3"
  },
  {
    title: "The Godfather",
    director: "Francis Ford Coppola",
    genre: ["Crime", "Drama"],
    releaseYear: "1972",
    imdbRating: "9.2"
  },
  {
    title: "The Dark Knight",
    director: "Christopher Nolan",
    genre: ["Action", "Crime", "Drama"],
    releaseYear: "2008",
    imdbRating: "9.0"
  },
  {
    title: "The Godfather: Part II",
    director: "Francis Ford Coppola",
    genre: ["Crime", "Drama"],
    releaseYear: "1974",
    imdbRating: "9.0"
  },
  {
    title: "12 Angry Men",
    director: "Sidney Lumet",
    genre: ["Crime", "Drama"],
    releaseYear: "1957",
    imdbRating: "9.0"
  },
  {
    title: "The Lord of the Rings: The Return of the King",
    director: "Peter Jackson",
    genre: ["Action", "Adventure", "Drama"],
    releaseYear: "2003",
    imdbRating: "8.9"
  },
  {
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    genre: ["Crime", "Drama"],
    releaseYear: "1994",
    imdbRating: "8.9"
  },
  {
    title: "Schindler's List",
    director: "Steven Spielberg",
    genre: ["Biography", "Drama", "History"],
    releaseYear: "1993",
    imdbRating: "8.9"
  },
  {
    title: "Inception",
    director: "Christopher Nolan",
    genre: ["Action", "Adventure", "Sci-Fi"],
    releaseYear: "2010",
    imdbRating: "8.8"
  },
  {
    title: "Fight Club",
    director: "David Fincher",
    genre: "Drama",
    releaseYear: "1999",
    imdbRating: "8.8"
  }
];

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
app.get("/movies/:title", (req, res) => {
  res.json(
    movies.find(movie => {
      return movie.title === req.params.title;
    })
  );
});
// Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get("/movies/:title/genre", (req, res) => {
  res.send("Here's the data about ___ genre");
});
// Return data about a director (bio, birth year, death year) by name
app.get("director/:name", (req, res) => {
  res.send("Here the details about the director ___");
});
// Allow new users to register
app.post("/users", (req, res) => {
  res.send("Thank you for subscribing to MyFlix");
});
// Allow users to update their user info (username)
app.put("/users/:username", (req, res) => {
  res.send("Successfully updated the username");
});
// Allow users to add a movie to their list of favorites
app.post("/users/:username/movies/:title", (req, res) => {
  res.send("Movie has been added to your favourites!");
});
// Allow users to remove a movie from their list of favorites
app.delete("/users/:username/movies/:title", (req, res) => {
  res.send("Movie has been deleted from your favourites!");
});
// Allow existing users to deregister
app.delete("/users/:username", (req, res) => {
  res.send("Your account has been deleted");
});
// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
