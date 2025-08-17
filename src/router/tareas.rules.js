// zona de importacion de modulos
import { body, param } from "express-validator"; // validacion de Body y param con espress-validator
import { DateTime } from "luxon"; // Libreria para manejo de fechas

// Reglas de express validator para tareas
// Reglas para crear tarea
export const createTareasRules = [
    // Validacion de atributo titulo
    body("titulo")
        .trim() // Sin espacion al inicio o final
        .notEmpty() // no puede estar vacio
        .withMessage("titulo requerido"), // Mensaje si algo falla
    // Validacion de atributo descripcion
    body("boardId")
        .notEmpty() // no puede estar vacio
        .isMongoId()
        .withMessage("El tablero debe ser referencia de un ObjectId válido"),
    body("descripcion")
        .notEmpty() // no puede estar vacio
        .withMessage("La descripcion no puede estar vacia"), // Mensaje si algo falla
    body("estado") 
        .customSanitizer(() => "pendiente")
        .custom((v) => v === "pendiente")
        .withMessage("estado debe ser 'pendiente' al crear"),
    body("fechaLimite")
        .custom((value) => {
        // Solo YYYY-MM-DD (sin hora)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            throw new Error("fechaLimite debe tener formato AAAA-MM-DD");
        }
        // Parse estricto en zona Bogota
        const dt = DateTime.fromISO(value, { zone: "America/Bogota" });
        if (!dt.isValid) {
            throw new Error("fechaLimite no corresponde a una fecha válida");
        }
        // Negocio: no pasado (permitimos hoy)
        const endOfDay = dt.endOf("day");
        const now = DateTime.now().setZone("America/Bogota");
        if (endOfDay < now) {
            throw new Error("fechaLimite no puede estar en el pasado");
        }
        return true;
        }),
    body("responsableId")
        .notEmpty() // no puede estar vacio
        .isMongoId()
        .withMessage("El Responsable debe ser referencia de un ObjectId válido"),
];
// Reglas para listar tareas
export const listTareasRules = [];
// Reglas para borrar tarea
export const deleteTareaRules = [
  param("id")
    .trim()
    .isMongoId()
    .withMessage("El parámetro :id debe ser un ObjectId válido"),
];
// Reglas para obtener tarea por id 
export const getTareaByIdRules = [
  param("id").trim().isMongoId().withMessage("El parámetro :id debe ser un ObjectId válido"),
];
// Regla para validacion de estado para actulizacion con progresion logica (Solo PATCH)
export const updateEstadoRules = [
  param("id").trim().isMongoId().withMessage("El parámetro :id debe ser un ObjectId válido"),
  body("estado")
    .exists().withMessage("estado requerido")
    .bail()
    .isString().withMessage("estado debe ser string")
    .bail()
    .customSanitizer(v => (typeof v === "string" ? v.trim().toLowerCase() : v))
    .isIn(["pendiente", "en_progreso", "completada"])
    .withMessage("estado inválido (use: pendiente | en_progreso | completada)"),
];
// Reglas para actualizar otros atrubutos con PUT o PATCH
export const updateTareaRules = [
  param("id").trim().isMongoId().withMessage("El parámetro :id debe ser un ObjectId válido"),
  body().custom((value, { req }) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Body vacío: envía al menos un campo a actualizar");
    }
    return true;
  }),
  body("titulo").optional().trim().notEmpty().withMessage("titulo inválido"),
  body("descripcion").optional().trim().notEmpty().withMessage("descripcion inválida"),
  body("boardId").optional().isMongoId().withMessage("boardId inválido"),
  body("responsableId").optional().isMongoId().withMessage("responsableId inválido"),
  body("fechaLimite")
    .optional()
    .custom((value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("fechaLimite debe tener formato AAAA-MM-DD");
      const dt = DateTime.fromISO(value, { zone: "America/Bogota" });
      if (!dt.isValid) throw new Error("fechaLimite no corresponde a una fecha válida");
      const endOfDay = dt.endOf("day");
      const now = DateTime.now().setZone("America/Bogota");
      if (endOfDay < now) throw new Error("fechaLimite no puede estar en el pasado");
      return true;
    }),
  // importante: NO permitir 'estado' aquí; va por endpoint dedicado
  body("estado").not().exists().withMessage("El estado se actualiza en /tareas/:id/estado"),
];