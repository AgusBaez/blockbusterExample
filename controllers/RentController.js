const db = require("../models/index");
const { Rent, Movie } = db;
const { Op } = require("sequelize");

//Calcular los dias de alquiler
const daysDifference = (start, end) => {
  const dateOne = new Date(start);

  const dateSecond = new Date(end);

  const oneDay = 3600 * 1000 * 24;

  const differenceTime = dateSecond.getTime() - dateOne.getTime();

  const differenceDays = Math.round(differenceTime / oneDay);

  return differenceDays;
};

const allRents = async (req, res, next) => {
  try {
    let id = req.user.id_user;

    await Rent.findOne({
      where: {
        UserId: id,
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
      if (!rental) throw new Error(" Missing stock ");
      await Rent.create({
        MovieMovieCode: code,
        UserId: req.user.id_user,
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

//Funcion agregar un 10% del precio original por cada dia de tardanza
const lateRefund = async (originalPrice, daysLate) => {
  let finalPrice = originalPrice;

  for (let i = 0; i < daysLate; i++) {
    finalPrice += finalPrice * 0.1;
  }

  return await finalPrice;
};

const devMovie = (req, res, next) => {
  const { code } = req.params;

  Rent.update(
    { userRefund_date: Date.now() },
    { where: { MovieMovieCode: code, UserId: req.user.id_user } }
  ).then(async (rent) => {
    let movie = await Movie.findOne({ where: { MovieCode: code } });
    Movie.update(
      { stock: movie.stock + 1 },
      { where: { MovieCode: code } }
    ).then(async () => {
      if (
        daysDifference(rent.Rent_date, rent.userRefund_date) <=
        daysDifference(rent.Rent_date, rent.refund_date)
      ) {
        res.status(200).send({
          msg: `Entrega a tiempo, Precio final: ${
            daysDifference(rent.Rent_date, rent.refund_date) * 10
          }`,
          onTime: true,
        });
      } else {
        console.log();
        res.status(200).send({
          msg: `Entrega tardia, Precio final: ${await lateRefund(
            400,
            daysDifference(rent.Rent_date, rent.userRefund_date)
          )} `,
          onTime: false,
        });
      }
    });
  });
};

module.exports = {
  allRents,
  rentMovie,
  devMovie,
};
