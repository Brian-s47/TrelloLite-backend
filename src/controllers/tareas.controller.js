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
// GET /api/tareas/:id
export async function getTareaById(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);
    const tarea = await col().findOne({ _id });
    if (!tarea) {
      return res.status(404).json({ ok: false, error: "NOT_FOUND", message: "Tarea no encontrada" });
    }
    return res.status(200).json({ ok: true, data: tarea });
  } catch (err) {
    return next(err);
  }
}
// PATCH /api/tareas/:id/estado
export async function updateEstadoTarea(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);
    const nueva = req.body.estado;
    console.log(nueva, req.body, req.params.id);
    // 1) Buscar la tarea
    const tarea = await col().findOne({ _id });
    if (!tarea) {
      return res.status(404).json({ 
        ok: false, 
        error: "NOT_FOUND", 
        message: "Tarea no encontrada" });
    }

    // 2) Validar transición
    const orden = ["pendiente", "en_progreso", "completada"];
    const idxActual = orden.indexOf(tarea.estado);
    const idxNueva = orden.indexOf(nueva);
    if (idxNueva !== idxActual + 1) {
      return res.status(400).json({
        ok: false,
        error: "INVALID_TRANSITION",
        message: `Transición inválida: ${tarea.estado} -> ${nueva}`,
      });
    }

    // 3) Actualizar
    const { value: updated } = await col().findOneAndUpdate(
      { _id },
      { $set: { estado: nueva, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    return res.json({ ok: true, data: updated });
  } catch (err) {
    return next(err);
  }
}
// PATCH || PUT /api/tareas/:id/estado
export async function updateTarea(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);
    const tareaDB = await col().findOne({ _id });
    if (!tareaDB) {
      return res.status(404).json({ ok: false, error: "NOT_FOUND", message: "Tarea no encontrada" });
    }

    // 1) Merge: doc actual + cambios del body (sin permitir 'estado' aquí)
    const merged = {
      ...tareaDB,
      ...req.body,
      updatedAt: new Date(),
    };
    delete merged.estado; // el estado se cambia en /tareas/:id/estado

    // 2) Instancia de dominio (convierte ids, normaliza strings/fechas)
    const tarea = new Tarea(merged);
    tarea.validar(); // reutiliza todas tus reglas de negocio

    // 3) Construir $set desde el documento plano saneado
    const doc = tarea.toDocument(); // incluye todos los campos “bien formados”
    const { _id: _omit, createdAt, ...safeSet } = doc; // no cambiamos _id ni createdAt

    // Si el body no traía alguno de estos, no los sobreescribas con undefined:
    for (const k of Object.keys(safeSet)) {
      if (safeSet[k] === undefined) delete safeSet[k];
    }

    const upd = await col().updateOne({ _id }, { $set: safeSet });
    if (upd.matchedCount === 0) {
      return res.status(404).json({ ok: false, error: "NOT_FOUND", message: "Tarea no encontrada" });
    }

    const updated = await col().findOne({ _id });
    return res.status(200).json({ ok: true, message: "Tarea actualizada correctamente", data: updated });
  } catch (err) {
    return next(err);
  }
}