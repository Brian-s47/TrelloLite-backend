// Zona de importacion de modulos
import { getDB } from "../config/db.js"; // Modulo para obtener DB
import { Tarea } from "../models/tarea.model.js"; // Modulos de clase Tarea
import { ObjectId } from "mongodb"; // Modulo para crar ID de mongoDB
import { successResponse, createdResponse, noContentResponse, errorResponse } from "../utils/responses.js";
// Obtener la coleccion de Tareas y la guardamos
const col = () => getDB().collection("tareas");

// POST /api/tareas
export async function createTarea(req, res, next) {
  try {
    const tarea = new Tarea({
      titulo: req.body.titulo,
      boardId: req.body.boardId,
      descripcion: req.body.descripcion,
      estado: req.body.estado,
      fechaLimite: req.body.fechaLimite,
      responsableId: req.body.responsableId,
    });
    tarea.validar();
    const { insertedId } = await col().insertOne(tarea.toDocument());
    return createdResponse(res, { id: insertedId });
  } catch (err) {
    return next(err);
  }
}
// GET /api/tareas
export async function listTareas(_req, res, next) {
  try {
    const tareas = await col().find().sort({ createdAt: -1 }).toArray();
    return successResponse(res, tareas, { total: tareas.length });
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
      return errorResponse(res, "Tarea no encontrada", 404, "NOT_FOUND");
    }

    const { deletedCount } = await col().deleteOne({ _id });
    if (deletedCount === 1) {
      return noContentResponse(res);
    }
    return errorResponse(res, "No se pudo eliminar la tarea", 500, "DELETE_FAILED");
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
      return errorResponse(res, "Tarea no encontrada", 404, "NOT_FOUND");
    }
    return successResponse(res, tarea);
  } catch (err) {
    return next(err);
  }
}
// PATCH /api/tareas/:id/estado
export async function updateEstadoTarea(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);
    const nueva = req.body.estado;
    const tarea = await col().findOne({ _id });
    if (!tarea) {
      return errorResponse(res, "Tarea no encontrada", 404, "NOT_FOUND");
    }

    const orden = ["pendiente", "en_progreso", "completada"];
    const idxActual = orden.indexOf(tarea.estado);
    const idxNueva = orden.indexOf(nueva);

    if (idxNueva !== idxActual + 1) {
      return errorResponse(
        res,
        `Transición inválida: ${tarea.estado} -> ${nueva}`,
        400,
        "INVALID_TRANSITION"
      );
    }

    const { value: updated } = await col().findOneAndUpdate(
      { _id },
      { $set: { estado: nueva, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

  return successResponse(res, updated);

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
      return errorResponse(res, "Tarea no encontrada", 404, "NOT_FOUND");
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
      return errorResponse(res, "Tarea no encontrada", 404, "NOT_FOUND");
    }

    const updated = await col().findOne({ _id });
    return successResponse(res, updated, null, 200);
  } catch (err) {
    return next(err);
  }
}