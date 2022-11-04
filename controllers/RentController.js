const db = require("../models/index");
const { Rent, Movie } = db;
const { Op } = require("sequelize");

//Funcion agregar un 10% del precio original por cada dia de tardanza
const lateRefund = async (originalPrice, daysLate) => {
  let finalPrice = originalPrice;

  for (let i = 0; i < daysLate; i++) {
    finalPrice += finalPrice * 0.1;
  }

  return finalPrice;
};

//Calcular los dias de alquiler
const daysDifference = (start, end) => {
  const dateOne = new Date(start);

  const dateSecond = new Date(end);

  const oneDay = 3600 * 1000 * 24;

  const differenceTime = dateSecond.getTime() - dateOne.getTime();

  const differenceDays = Math.round(differenceTime / oneDay);

  return differenceDays;
};

const allRents = (req, res, next) => {
  let id = req.user.id_user;

  Rent.findOne({
    where: {
      userId: id,
    },
  }).then((rental) => res.status(200).send(rental));
};

const rentMovie = async (req, res, next) => {
  const paramData = req.params;

  await Movie.findOne({
    where: { code: paramData.code, stock: { [Op.gt]: 0 } },
  })
    .then((rental) => {
      if (!rental) throw new Error(" Missing stock ");

      Rent.create({
        MovieCode: paramData.code,
        UserId: req.user.id_user,
        rent_date: new Date(Date.now()),
        refund_date: new Date(Date.now() + 3600 * 1000 * 24 * 7),
      })
        .then((data) => {
          Movie.update(
            { stock: rental.stock - 1, rentals: rental.rentals + 1 },
            { where: { code: rental.code } }
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

const devMovie = (req, res, next) => {
  const { code } = req.params;

  Rent.update(
    { userRefund_date: Date.now() },
    { where: { code: code, id_user: req.usuario.id_user } }
  ).then(async (rent) => {
    let movie = await Movie.findOne({ where: { code: code } });
    Movie.update({ stock: movie.stock + 1 }, { where: { code: code } }).then(
      () => {
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
          res.status(200).send({
            msg: `Entrega tardia, Precio final: >>>> TODO: FUNCTION PENALTY FEE <<<< `,
            onTime: false,
          });
        }
      }
    );
  });
};

module.exports = {
  allRents,
  rentMovie,
  devMovie,
};
