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
// GET /api/tableros/:id
export async function getTableroById(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);
    const col = () => getDB().collection("tableros");

    const tablero = await col().findOne({ _id });
    if (!tablero) {
      return res.status(404).json({
        ok: false,
        error: "NOT_FOUND",
        message: "Tablero no encontrado",
      });
    }

    return res.status(200).json({ ok: true, data: tablero });
  } catch (err) {
    return next(err);
  }
}
// PUT || PATCH /api/tableros/:id
export async function updateTablero(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);
    const col = () => getDB().collection("tableros");

    // Construir $set solo con lo que venga
    const set = { updatedAt: new Date() };
    if (typeof req.body.nombre === "string") set.nombre = req.body.nombre.trim();
    if (typeof req.body.descripcion === "string") set.descripcion = req.body.descripcion.trim();
    if (Array.isArray(req.body.miembros)) {
      set.miembros = req.body.miembros.map((id) => new ObjectId(id));
    }

    // 1) Actualizar
    const upd = await col().updateOne({ _id }, { $set: set });

    // 2) Si no existe → 404
    if (upd.matchedCount === 0) {
      return res.status(404).json({ 
        ok: false, 
        error: "NOT_FOUND", 
        message: "Tablero no encontrado" });
    }

    // 3) Leer documento actualizado y responder 200 con message
    const updated = await col().findOne({ _id });
    return res.status(200).json({
      ok: true,
      message: "Tablero actualizado correctamente",
      data: updated,
    });
  } catch (err) {
    // nombre duplicado (si tienes índice único por nombre)
    if (err?.code === 11000) {
      return res.status(409).json({
        ok: false,
        error: "DUPLICATE_KEY",
        message: "El nombre de tablero ya existe",
        key: "nombre",
      });
    }
    return next(err);
  }
}
