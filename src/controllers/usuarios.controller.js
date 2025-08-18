// Zona de importacion de modulos
import { getDB } from "../config/db.js"; // Modulo para obtener DB
import { Usuario } from "../models/usuario.model.js"; // Modulos de clase Usuario
import { ObjectId } from "mongodb"; // Modulo para crar ID de mongoDB
import { successResponse, createdResponse, noContentResponse, errorResponse } from "../utils/responses.js";

// Obtener la coleccion de usuarios y la guardamos
const col = () => getDB().collection("usuarios");

// POST /api/usuarios
export async function createUser(req, res, next) {
  try {
    const user = new Usuario({
      nombre: req.body.nombre,
      email: req.body.email,
    });
    user.validar();
    const { insertedId } = await col().insertOne(user.toDocument());
    return createdResponse(res, { id: insertedId });
  } catch (err) {
    // email único => error 11000
    if (err?.code === 11000) {
      return errorResponse(res, "El email ya existe", 409, "DUPLICATE_KEY", { key: "email" });
    }
    return next(err);
  }
}
// GET /api/usuarios
export async function listUsers(_req, res, next) {
  try {
    const users = await col().find().sort({ createdAt: -1 }).toArray();
    return successResponse(res, users, { total: users.length });
  } catch (err) {
    next(err);
  }
}
// GET /api/usuarios/:id
export async function getUserById(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);
    const user = await col().findOne({ _id });
    if (!user) {
      return errorResponse(res, "Usuario no encontrado", 404, "NOT_FOUND");
    }
    return successResponse(res, user);
  } catch (err) {
    next(err);
  }
}
// PUT || PATCH /api/usuarios/:id
export async function updateUser(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);

    // construir $set solo con campos presentes
    const set = { updatedAt: new Date() };
    if (typeof req.body.nombre === "string") 
      set.nombre = req.body.nombre.trim();
    if (typeof req.body.email === "string") 
      set.email = req.body.email.trim().toLowerCase();

    // Log de pruebas
    console.log("Buscando usuario con _id:", _id);
    const result = await col().findOneAndUpdate(
      { _id },
      { $set: set },
      { returnDocument: "after" }
    );
    // Log de pruebas
    console.log("Resultado de findOneAndUpdate:", result);
    if (!result) {
      return errorResponse(res, "Usuario no encontrado", 404, "NOT_FOUND");
    }
    return successResponse(res, result);
  } catch (err) {
    // conflicto por email duplicado
    if (err?.code === 11000) {
      return errorResponse(res, "El email ya existe", 409, "DUPLICATE_KEY", { key: "email" });
    }
    next(err);
  }
}
// DELETE /api/usuarios/:id
export async function deleteUser(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);
    const result = await col().deleteOne({ _id });

    if (result.deletedCount === 1) {
      return noContentResponse(res);
    }

    return errorResponse(res, "Usuario no encontrado", 404, "NOT_FOUND");
  } catch (err) {
    return next(err);
  }
}
