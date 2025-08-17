// Zona de importacion de modulos
import { getDB } from "../config/db.js"; // Modulo para obtener DB
import { Tarea } from "../models/tarea.model.js"; // Modulos de clase Tarea
import { ObjectId } from "mongodb"; // Modulo para crar ID de mongoDB
// Obtener la coleccion de Tareas y la guardamos
const col = () => getDB().collection("tareas");

// POST /api/tareas
export async function createTarea(req, res, next) {
  try {
    // 1) capa HTTP ya validada por express-validator
    // 2) capa de dominio
    const tarea = new Tarea({
      titulo: req.body.titulo,
      boardId: req.body.boardId,
      descripcion: req.body.descripcion,
      estado: req.body.estado,
      fechaLimite: req.body.fechaLimite,
      responsableId: req.body.responsableId,
    });
    tarea.validar();
    // 3) persistencia
    const { insertedId } = await col().insertOne(tarea.toDocument());
    return res.status(201).json({ ok: true, id: insertedId });
  } catch (err) {
    return next(err);
  }
}
// GET /api/tareas
export async function listTareas(_req, res, next) {
  try {
    const tareas = await col().find().sort({ createdAt: -1 }).toArray();
    return res.json({ ok: true, data: tareas });
  } catch (err) {
    return next(err);
  }
}
// DELETE /api/tareas/:id
export async function deleteTarea(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);

    const tarea = await col().findOne({ _id });
    if (!tarea) {
      return res.status(404).json({
        ok: false,
        error: "NOT_FOUND",
        message: "Tarea no encontrada",
      });
    }

    const { deletedCount } = await col().deleteOne({ _id });
    if (deletedCount === 1) return res.status(204).send();

    return res.status(500).json({
      ok: false,
      error: "DELETE_FAILED",
      message: "No se pudo eliminar la tarea.",
    });
  } catch (err) {
    return next(err);
  }
}