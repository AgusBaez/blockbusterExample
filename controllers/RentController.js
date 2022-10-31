const db = require('../models/index');
const { Rent, Movie } = db
const { Op } = require('sequelize');



const daysDifference = (start, end) => {

    const dateOne = new Date(start)

    const dateSecond = new Date(end)

    const oneDay = (3600 * 1000 * 24)

    const differenceTime = dateSecond.getTime() - dateOne.getTime()

    const differenceDays = Math.round(differenceTime / oneDay)

    return differenceDays
}


const rentMovie = (req, res, next) => {
    
    const { code } = req.params;
    
    Movie.findOne({ where: { code: code, stock: { [Op.gt]: 0 } } })
    .then(rental => {
            if (!rental) throw new Error(' Missing stock ')
            Rent.create({
                code: rental.code,
                id_user: req.user.id,
                rent_date:new Date(Date.now()),
                refund_date: new Date(Date.now() + (3600 * 1000 * 24) * 7),
            }).then(data => {
                Movie.update({ stock: rental.stock - 1, rentals: rental.rentals + 1 }, { where: { code: rental.code } })
                    .then(() => res.status(201).send(data))
            })
        })
}

//Funcion agregar un 10% del precio original por cada dia de tardanza
const lateRefund = async (originalPrice, daysLate) => {
    let finalPrice = originalPrice;

    for (let i = 0; i < daysLate; i++) {
        finalPrice += finalPrice * 0.1
    };

    return finalPrice;
}

const devMovie = (req, res, next) => {

    const { code } = req.params

    Rent.update({ userRefund_date: Date.now() }, { where: { code: code, id_user: req.user.id } })
        .then(async rent => {
            let movie = await Movie.findOne({ where: { code: code } })
            Movie.update({ stock: movie.stock + 1 }, { where: { code: code } })
                .then(() => {
                    if (daysDifference(rent.Rent_date, rent.userRefund_date) <= daysDifference(rent.Rent_date, rent.refund_date)) {
                        
                        res.status(200).send({ msg: `Entrega a tiempo, Precio final: ${daysDifference(rent.Rent_date, rent.refund_date) * 10}`, onTime: true })
                    } else {
                        res.status(200).send({ msg: `Entrega tardia, Precio final: >>>> TODO: FUNCTION PENALTY FEE <<<< `, onTime: false })
                    }
                })
        })

}



module.exports = {
    rentMovie,
    devMovie
}