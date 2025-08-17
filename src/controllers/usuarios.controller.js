// Zona de importacion de modulos
import { getDB } from "../config/db.js"; // Modulo para obtener DB
import { Usuario } from "../models/usuario.model.js"; // Modulos de clase Usuario
import { ObjectId } from "mongodb"; // Modulo para crar ID de mongoDB

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
// GET /api/usuarios/:id
export async function getUserById(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);
    const user = await col().findOne({ _id });
    if (!user) {
      return res.status(404).json({
        ok: false,
        error: "NOT_FOUND",
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({ ok: true, data: user });
  } catch (err) {
    return next(err);
  }
}
// PUT || PATCH /api/usuarios/:id
export async function updateUser(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);
    const col = () => getDB().collection("usuarios");

    // construir $set solo con campos presentes
    const set = { updatedAt: new Date() };
    if (typeof req.body.nombre === "string") set.nombre = req.body.nombre.trim();
    if (typeof req.body.email === "string") set.email = req.body.email.trim().toLowerCase();

    const result = await col().findOneAndUpdate(
      { _id },
      { $set: set },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({
        ok: false,
        error: "NOT_FOUND",
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({ ok: true, data: result.value });
  } catch (err) {
    // conflicto por email duplicado
    if (err?.code === 11000) {
      return res.status(409).json({ ok: false, error: "email ya registrado" });
    }
    return next(err);
  }
}
// DELETE /api/usuarios/:id
export async function deleteUser(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);

    // 1) verificar existencia para responder 404 coherente
    const user = await col().findOne({ _id });
    if (!user) {
      return res.status(404).json({
        ok: false,
        error: "NOT_FOUND",
        message: "Usuario no encontrado",
      });
    }

    // 2) borrar usuario (HARD DELETE)
    const { deletedCount } = await col().deleteOne({ _id });
    if (deletedCount === 1) return res.status(204).send();

    // 3) caso raro: existía pero no se borró
    return res.status(500).json({
      ok: false,
      error: "DELETE_FAILED",
      message: "No se pudo eliminar el usuario.",
    });
  } catch (err) {
    return next(err);
  }
}
