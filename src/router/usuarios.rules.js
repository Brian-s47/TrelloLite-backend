// zona de importacion de modulos
import { body, param } from "express-validator"; // validacion de Body con espressvalidator

// Reglas de express validator para usuarios
// Reglas de crear un usuario
export const createUserRules = [
    // Validacion de atributo nombre
    body("nombre")
        .trim() // Sin espacion al inicio o final
        .notEmpty() // no puede estar vacio
        .withMessage("nombre requerido"), // Mensaje si algo falla
    // Validacion de atributo email
    body("email")
        .trim() // Sin espacion al inicio o final
        .isEmail() // Tiene formato de correo
        .withMessage("email inválido"), // Mensaje si algo falla
];
// Reglas de listar usuarios
export const listUsersRules = [];
// Reglas de mostrar un suuario por ID
export const getUserByIdRules = [
  param("id").trim().isMongoId().withMessage("El parámetro :id debe ser un ObjectId válido"),
];
// Reglas para actualizar un usuario por ID
export const updateUserRules = [
    param("id").trim().isMongoId().withMessage("El parámetro :id debe ser un ObjectId válido"),
    body().custom((value, { req }) => {
    // Condicional de Body vacio
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
    body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("email inválido"),
];
// Reglas para borrar un usuario por ID
export const deleteUserRules = [
  param("id")
    .trim()
    .isMongoId()
    .withMessage("El parámetro :id debe ser un ObjectId válido"),
];