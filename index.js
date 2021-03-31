const express = require("express");
morgan = require("morgan");
const app = express();

app.use(morgan("common"));
app.use(express.static("public"));
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

app.get("/movies", (req, res) => {
  res.json(movies);
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
