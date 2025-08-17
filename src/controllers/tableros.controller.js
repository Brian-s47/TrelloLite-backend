// Zona de importacion de modulos
import { getDB } from "../config/db.js"; // Modulo para obtener DB
import { Tablero } from "../models/tablero.model.js"; // Modulos de clase Tablero
import { ObjectId } from "mongodb"; // Modulo para crar ID de mongoDB

// Obtener la coleccion de usuarios y la guardamos
const col = () => getDB().collection("tableros");
const colTareas = () => getDB().collection("tareas");

// POST /api/tableros
export async function createTablero(req, res, next) {
  try {
    // 1) capa HTTP ya validada por express-validator
    // 2) capa de dominio
    const tablero = new Tablero({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      miembros: req.body.miembros,
    });
    tablero.validar();
    // 3) persistencia
    const { insertedId } = await col().insertOne(tablero.toDocument());
    return res.status(201).json({ ok: true, id: insertedId });
  } catch (err) {
    return next(err);
  }
}
// GET /api/tableros
export async function listTableros(_req, res, next) {
  try {
    const tableros = await col().find().sort({ createdAt: -1 }).toArray();
    return res.json({ ok: true, data: tableros });
  } catch (err) {
    return next(err);
  }
}
// DELETE /api/tableros/:id
export async function deleteTablero(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);

    // 1) verificar existencia del tablero para responder 404 coherente
    const tablero = await col().findOne({ _id });
    if (!tablero) {
      return res.status(404).json({
        ok: false,
        error: "NOT_FOUND",
        message: "Tablero no encontrado",
      });
    }

    // 2) borrar tareas del tablero
    const tareasResult = await colTareas().deleteMany({ boardId: _id });

    // 3) borrar tablero
    const tableroResult = await col().deleteOne({ _id });

    if (tableroResult.deletedCount === 1) {
      // estándar: 204 No Content
      return res.status(204).send();
    }

    // caso raro: existía pero no se borró
    return res.status(500).json({
      ok: false,
      error: "DELETE_FAILED",
      message: "No se pudo eliminar el tablero.",
      meta: { tareasBorradas: tareasResult.deletedCount },
    });
  } catch (err) {
    return next(err);
  }
}
