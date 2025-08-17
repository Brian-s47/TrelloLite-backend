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
// Reglas para lisatr tareas
export const listTareasRules = [];
// Reglas para borrar tarea
export const deleteTareaRules = [
  param("id")
    .trim()
    .isMongoId()
    .withMessage("El parámetro :id debe ser un ObjectId válido"),
];