// zona de importacion de modulos
import { body, param } from "express-validator"; // validacion de Body con espressvalidator

// Reglas de express validator para tableros
// Reglas para crear un tablero
export const createTablerosRules = [
    // Validacion de atributo nombre
    body("nombre")
        .trim() // Sin espacion al inicio o final
        .notEmpty() // no puede estar vacio
        .withMessage("nombre requerido"), // Mensaje si algo falla
    // Validacion de atributo descripcion
    body("descripcion")
        .trim() // Sin espacion al inicio o final
        .notEmpty() // no puede estar vacio
        .withMessage("descripcion inválida"), // Mensaje si algo falla
    body("miembros")
        .isArray({ min: 1 }) // Debe ser un array
        .notEmpty() // no puede estar vacio
        .withMessage("Debe ternrer almenos un miembro"), // Mensaje si algo falla
    body("miembros.*") // Validacion de Id  para cada miembro del array
        .isMongoId().withMessage("cada miembro debe ser un ObjectId válido"),
];
// Reglas para listar todos los tableros
export const listTablerosRules = [];
// Reglas para eliminar un tablero tableros y en cascada todos los asociados a el.
export const deleteTableroRules = [
    param("id")
        .trim()
        .isMongoId()
        .withMessage("El parámetro :id debe ser un ObjectId válido"),
];
// Reglas para obtener tablero por Id
export const getTableroByIdRules = [
  param("id").trim().isMongoId().withMessage("El parámetro :id debe ser un ObjectId válido"),
];
// Reglas para actualizar tablero por Id
export const updateTableroRules = [
  param("id").trim().isMongoId().withMessage("El parámetro :id debe ser un ObjectId válido"),
  body().custom((value, { req }) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Body vacío: envía al menos un campo a actualizar");
    }
    return true;
  }),
  body("nombre")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("nombre inválido"),
  body("descripcion")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("descripcion inválida"),
  body("miembros")
    .optional()
    .isArray({ min: 1 })
    .withMessage("miembros debe ser un array de al menos un ObjectId"),
  body("miembros.*")
    .optional()
    .isMongoId()
    .withMessage("cada miembro debe ser un ObjectId válido"),
];