// Zona de importacion de modulos
import { getDB } from "../config/db.js"; // Modulo para obtener DB
import { Tablero } from "../models/tablero.model.js"; // Modulos de clase Tablero
import { ObjectId } from "mongodb"; // Modulo para crar ID de mongoDB
import { successResponse, createdResponse, noContentResponse, errorResponse } from "../utils/responses.js";

// Obtener la coleccion de usuarios y la guardamos
const col = () => getDB().collection("tableros");
const colTareas = () => getDB().collection("tareas");

// POST /api/tableros
export async function createTablero(req, res, next) {
  try {
    const tablero = new Tablero({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      miembros: req.body.miembros,
    });
    tablero.validar();
    const { insertedId } = await col().insertOne(tablero.toDocument());
    return createdResponse(res, { id: insertedId });
  } catch (err) {
    return next(err);
  }
}
// GET /api/tableros
export async function listTableros(_req, res, next) {
  try {
    const tableros = await col().find().sort({ createdAt: -1 }).toArray();
    return successResponse(res, tableros);
  } catch (err) {
    return next(err);
  }
}
// DELETE /api/tableros/:id
export async function deleteTablero(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);

    const tablero = await col().findOne({ _id });
    if (!tablero) {
      return errorResponse(res, "Tablero no encontrado", 404, "NOT_FOUND");
    }

    const tareasResult = await colTareas().deleteMany({ boardId: _id });

    const tableroResult = await col().deleteOne({ _id });

    if (tableroResult.deletedCount === 1) {
      return noContentResponse(res);
    }

    return errorResponse(res,"No se pudo eliminar el tablero.", 500, "DELETE_FAILED" );
  } catch (err) {
    return next(err);
  }
}
// GET /api/tableros/:id
export async function getTableroById(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);
    const col = () => getDB().collection("tableros");
    const tablero = await col().findOne({ _id });
    if (!tablero) {
      return errorResponse(res, "Tablero no encontrado", 404, "NOT_FOUND");
    }
    return successResponse(res, tablero);
  } catch (err) {
    return next(err);
  }
}
// PUT || PATCH /api/tableros/:id
export async function updateTablero(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);

    // Construir $set solo con lo que venga
    const set = { updatedAt: new Date() };
    if (typeof req.body.nombre === "string") set.nombre = req.body.nombre.trim();
    if (typeof req.body.descripcion === "string") set.descripcion = req.body.descripcion.trim();
    if (Array.isArray(req.body.miembros)) {
      set.miembros = req.body.miembros.map((id) => new ObjectId(id));
    }

    const upd = await col().updateOne({ _id }, { $set: set });

    if (upd.matchedCount === 0) {
      return errorResponse(res, "Tablero no encontrado", 404, "NOT_FOUND");
    }

    const updated = await col().findOne({ _id });
    return successResponse(res, updated, { message: "Tablero actualizado correctamente" });
  } catch (err) {
    if (err?.code === 11000) {
      return errorResponse(
        res,
        "El nombre de tablero ya existe",
        409,
        "DUPLICATE_KEY",
        { key: "nombre" }
      );
    }
    return next(err);
  }
}
