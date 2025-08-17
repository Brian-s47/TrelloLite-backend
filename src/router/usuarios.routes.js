// Zona de importacion de modulos
import { Router } from "express"; // rutas de express
import { validate } from "../middlewares/validate.js"; // Validator-express
import { createUserRules, listUsersRules, getUserByIdRules, updateUserRules, deleteUserRules } from "./usuarios.rules.js"; // Modulos valitador express
import { createUser, listUsers, getUserById, updateUser, deleteUser } from "../controllers/usuarios.controller.js"; // Metodos de crear y listar usuarios

// Inicializacion de rutas de express
const router = Router();

// Rutas  de usuarios
router.post("/usuarios", createUserRules, validate, createUser); // Post para crear usuario
router.get("/usuarios", listUsersRules, validate, listUsers); // Para obterner usuarios
router.get("/usuarios/:id", getUserByIdRules, validate, getUserById); // Para obterner un usuario por ID
router.put("/usuarios/:id", updateUserRules, validate, updateUser); // Para actualizar un usuario por ID
router.patch("/usuarios/:id", updateUserRules, validate, updateUser); // Para actualizar un usuario por ID
router.delete("/usuarios/:id", deleteUserRules, validate, deleteUser); // Para eliminar un usuario por ID

// Exportamos todas las turas en routes
export default router;
