// Zona de importacion de modulos
import { getDB } from "../config/db.js"; // Modulo para obtener DB
import { Usuario } from "../models/usuario.model.js"; // Modulos de clase Usuario

// Obtener la coleccion de usuarios y la guardamos
const col = () => getDB().collection("usuarios");

// POST /api/usuarios
export async function createUser(req, res, next) {
  try {
    // 1) capa HTTP ya validada por express-validator
    // 2) capa de dominio
    const user = new Usuario({
      nombre: req.body.nombre,
      email: req.body.email,
    });
    user.validar();
    // 3) persistencia
    const { insertedId } = await col().insertOne(user.toDocument());
    return res.status(201).json({ ok: true, id: insertedId });
  } catch (err) {
    // email único => error 11000
    if (err?.code === 11000) {
      return res.status(409).json({ ok: false, error: "email ya registrado" });
    }
    return next(err);
  }
}

// GET /api/usuarios
export async function listUsers(_req, res, next) {
  try {
    const users = await col().find().sort({ createdAt: -1 }).toArray();
    return res.json({ ok: true, data: users });
  } catch (err) {
    return next(err);
  }
}
