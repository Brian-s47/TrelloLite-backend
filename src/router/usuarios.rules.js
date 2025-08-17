// zona de importacion de modulos
import { body } from "express-validator"; // validacion de Body con espressvalidator

// Reglas de express validator para usuarios
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

export const listUsersRules = [];