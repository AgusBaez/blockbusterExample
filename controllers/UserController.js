const db = require("../models/index");
const { User } = db;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = (req, res, next) => {
  let body = req.body;
  User.findOne({ where: { email: body.email } })
    .then((usuarioDB) => {
      if (!usuarioDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Usuario o contraseña incorrectos",
          },
        });
      }
      // Valida que la contraseña escrita por el usuario, sea la almacenada en la db
      if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Usuario o contraseña incorrectos",
          },
        });
      }
      // Genera el token de autenticación
      let token = jwt.sign(
        {
          usuario: usuarioDB,
        },
        process.env.SEED_AUTENTICACION,
        {
          expiresIn: process.env.CADUCIDAD_TOKEN,
        }
      );
      res.json({
        ok: true,
        usuario: usuarioDB,
        token,
      });
    })
    .catch((error) => {
      error = new Error("An error occurred when LOGIN user");
      error.status = 400;
      res.status(400).send("An erroUsuario o contraseña incorrectos");
      return next(error);
    });
};

const register = (req, res, next) => {
  try {
    let { email, password, dni, phone } = req.body;
    let usuario = {
      email,
      dni,
      phone,
      password: bcrypt.hashSync(password, 10),
      id_user: "Parche"
    };
    User.create(usuario).then((usuarioDB) => {
      return res
        .status(201)
        .json({
          ok: true,
          usuario: usuarioDB,
        })
        .end();
    });
  } catch (error) {
    error = new Error("An error occurred when REGISTER user");
    error.status = 400;
    res.status(400).send("An error occurred when register, try again");
    return next(error);
  }
};

const singOut = (req, res, next) => {
  try {
    req.user = null;

    res.redirect("/login");
  } catch (error) {
    error = new Error("An error occurred when singOut");
    error.status = 400;
    res.status(400).send("An error occurred, try again");
    return next(error);
  }
};

module.exports = {
  login,
  register,
  singOut,
};
