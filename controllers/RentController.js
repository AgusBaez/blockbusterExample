const db = require("../models/index");
const { Rent, Movie } = db;
const { Op } = require("sequelize");
const { rentPrice } = require("../middlewares/priceRent");

const allRents = async (req, res, next) => {
  try {
    await Rent.findOne({
      where: {
        UserUserId: req.user.UserId,
      },
    }).then((rental) => {
      res.status(200).send(rental);
    });
  } catch (error) {
    console.log(error);
    error = new Error("The rents does not exist");
    error.status = 400;
    res.status(400).send("An error occurred");
    return next(error);
  }
};

const rentMovie = async (req, res, next) => {
  const { code } = req.params;

  await Movie.findOne({
    where: { MovieCode: code, stock: { [Op.gt]: 0 } },
  })
    .then(async (rental) => {
      if (!rental) {
        new Error(" Missing stock ");
        res.status(400).send("BlockBuster says: Missing Stock");
      }
      await Rent.create({
        MovieMovieCode: code,
        UserUserId: req.user.UserId,
        rent_date: new Date(Date.now()),
        refund_date: new Date(Date.now() + 3600 * 1000 * 24 * 7),
      })
        .then((data) => {
          Movie.update(
            { stock: rental.stock - 1, rentals: rental.rentals + 1 },
            { where: { MovieCode: code } }
          ).then(() => res.status(201).send(data));
        })
        .catch((error) => {
          console.log(error);
          error = new Error("An error occurred when update a movie");
          error.status = 400;
          res.status(400).send("An error occurred when rent a movie");
          return next(error);
        });
    })
    .catch((error) => {
      console.log(error);
      error = new Error("The movie does not exist");
      error.status = 400;
      res.status(400).send("An error occurred while renting a movie");
      return next(error);
    });
};

const devMovie = async (req, res, next) => {
  //Codigo de la pelicula
  try {
    const { code } = req.params;

    //Busca si existe la renta
    await Rent.findOne({
      where: {
        MovieMovieCode: code,
        UserUserId: req.user.UserId,
        userRefund_date: null,
      },
    }).then(async (rent) => {
      if (!rent) {
        return res.status(404).json({ errorMessage: "Rent not found" });
      } else {
        //La pelicula alquilada es;
        let movie = await Movie.findOne({ where: { MovieCode: code } });
        //Actualizar: Stock de la pelicula;
        await Movie.update(
          { stock: movie.stock + 1 },
          { where: { MovieCode: code } }
        );

        await Rent.update(
          //Actualizar: fecha de devolcion en la renta donde:
          { userRefund_date: Date.now() },
          {
            where: {
              MovieMovieCode: code,
              UserUserId: req.user.UserId,
              userRefund_date: null,
            },
          }
        );

        res
          .status(200)
          .send(
            `The movie was returned on date ${Date(
              rent.dataValues.userRefund_date
            )}, \n The expected date is ${Date(
              rent.dataValues.refund_date
            )}, \n Final price is: ${rentPrice(
              (userReturn = rent.dataValues.userRefund_date),
              (estimatedDate = rent.dataValues.refund_date)
            )}`
          );
      }
    });
  } catch (error) {
    console.log(error);
    error = new Error("Error in the return of a film");
    error.status = 400;
    res.status(400).send("BlockBuster says Error while returning a rent");
    return next(error);
  }
};

module.exports = {
  allRents,
  rentMovie,
  devMovie,
};
