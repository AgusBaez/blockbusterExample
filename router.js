const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const MovieController = require("./controllers/MovieController");
const UsersController = require("./controllers/UserController");
const RentController = require("./controllers/RentController");
const { checkLoggedIn, checkLoggedUser } = require("./middlewares/checks");
const errorHandler = require("./middlewares/errorHandler");

router.use(bodyParser.json());
router.get("/movies", checkLoggedUser, MovieController.getMovies);
router.get("/movies/title", MovieController.getMovieByTitle);
router.get("/movies/:id", MovieController.getMovieDetails);
router.get("/runtime/:max", MovieController.getMoviesByRuntime);
router.get("/favourites", checkLoggedUser, MovieController.allFavouritesMovies);

router.post("/register", UsersController.register);
router.post("/login", UsersController.login);
router.get("/login", (req, res) => res.send("You must to logued in"));
router.get("/signout", checkLoggedUser, UsersController.singOut);

router.post("/movie", checkLoggedIn, MovieController.addMovie);
router.put("/rent/:code", checkLoggedUser, RentController.devMovie);
router.post("/rent/:code", checkLoggedUser, RentController.rentMovie);
router.post("/favourite/:code", checkLoggedUser, MovieController.addFavourite);

router.use(errorHandler.notFound);

module.exports = router;
