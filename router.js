const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const MovieController = require("./controllers/MovieController");
const UsersController = require("./controllers/UserController");
const RentController = require("./controllers/RentController");
const { checkLoggedUser } = require("./middlewares/checks");
const errorHandler = require("./middlewares/errorHandler");

router.use(bodyParser.json());
router.get("/movies", checkLoggedUser, MovieController.getMovies);
router.post("/movie", checkLoggedUser, MovieController.addMovie);
router.get("/movies/title", checkLoggedUser, MovieController.getMovieByTitle);
router.get("/movies/:id", checkLoggedUser, MovieController.getMovieDetails);
router.get(
  "/runtime/:max",
  checkLoggedUser,
  MovieController.getMoviesByRuntime
);
router.get("/favourites", checkLoggedUser, MovieController.allFavouritesMovies);
router.post("/favourite/:code", checkLoggedUser, MovieController.addFavourite);

router.post("/register", UsersController.register);
router.post("/login", UsersController.login);
router.get("/login", (req, res) =>
  res.send("ooh.. See you soon!! BlockBuster says, please log in.")
);
router.get("/signout", checkLoggedUser, UsersController.singOut);

router.get("/rent", checkLoggedUser, RentController.allRents);
router.put("/rent/:code", checkLoggedUser, RentController.devMovie);
router.post("/rent/:code", checkLoggedUser, RentController.rentMovie);

router.use(errorHandler.notFound);

module.exports = router;
