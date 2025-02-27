const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");
const { getMenuFrontEnd } = require("../helpers/menu-frontend");

const getUsuarios = async (req, res = response) => {
  try {
    const desde = Math.max(0, Number(req.query.desde) || 0);
    const hasta = Math.max(0, Number(req.query.hasta) || 10);

    if (hasta <= 0 || desde >= hasta) {
      return res.json({
        ok: true,
        usuarios: [],
        uid: req.uid,
        total: 0,
      });
    }

    const limite = hasta - desde; // Calcular el límite correcto

    const [usuarios, total] = await Promise.all([
      Usuario.find({}, "nombre correo rol estado img")
        .populate({
          path: "rol",
          populate: {
            path: "modulos",
            model: "Modulo",
          },
        })
        .populate("sedes")
        .sort({ updatedAt: -1 })
        .skip(desde)
        .limit(limite)
        .lean(),
      Usuario.countDocuments(),
    ]);

    res.json({
      usuarios,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const getUsuario = async (req, res = response) => {
  try {
    const { id } = req.params;

    // Poblar el rol para obtener toda su información
    const usuario = await Usuario.findById(id).populate("rol", "nombre slug");

    if (!usuario) {
      res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }

    res.json({
      ok: true,
      usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const crearUsuario = async (req, res = response) => {
  const { correo, password, nombre, rol, sedes } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ correo });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya existe",
      });
    }

    const data = {
      nombre,
      correo,
      password,
      rol,
      sedes,
    };

    const usuario = new Usuario(data);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    //Generar JWT
    const token = await generarJWT(usuario.uid);

    // populate
    const usuarioNewData = await usuario.populate({
      path: "rol",
      populate: {
        path: "modulos",
        model: "Modulo",
      },
    });

    res.json({
      ok: true,
      usuario: usuarioNewData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarUsuario = async (req, res = response) => {
  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
    }

    // Actualizaciones
    const { password, correo, ...campos } = req.body;

    if (usuarioDB.correo !== correo) {
      const existeEmail = await Usuario.findOne({ correo });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un usuario con ese correo",
        });
      }

      campos.correo = correo;
    }

    function comparePassword(password, usuarioDB) {
      return bcrypt.compareSync(password, usuarioDB);
    }

    if (password !== undefined) {
      if (comparePassword(password, usuarioDB.password) === false) {
        if (usuarioDB.password !== password) {
          const salt = bcrypt.genSaltSync();
          campos.password = bcrypt.hashSync(password, salt);
        } else {
          campos.password = password;
        }
      }
    } else {
      campos.password = usuarioDB.password;
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    })
      .populate({
        path: "rol",
        populate: {
          path: "modulos",
          model: "Modulo",
        },
      })
      .populate("sedes");

    res.json({
      ok: true,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const inactivarUsuario = async (req, res = response) => {
  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "El usuario no existe",
      });
    }

    const usuario = await Usuario.findByIdAndUpdate(
      uid,
      { estado: false },
      { new: true }
    );

    res.json({
      ok: true,
      usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const activarUsuario = async (req, res = response) => {
  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "El usuario no existe",
      });
    }

    const usuario = await Usuario.findByIdAndUpdate(
      uid,
      { estado: true },
      { new: true }
    );

    res.json({
      ok: true,
      usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarUsuario = async (req, res = response) => {
  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
    }

    const usuario = await Usuario.findByIdAndDelete(uid);

    res.json({
      ok: true,
      msg: "Usuario eliminado",
      usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getUsuarios,
  getUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  inactivarUsuario,
  activarUsuario,
};
