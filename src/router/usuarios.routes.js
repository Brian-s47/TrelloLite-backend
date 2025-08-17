// Zona de importacion de modulos
import { Router } from "express"; // rutas de express
import { validate } from "../middlewares/validate.js"; // Validator-express
import { createUserRules, listUsersRules } from "./usuarios.rules.js"; // Modulos valitador express
import { createUser, listUsers } from "../controllers/usuarios.controller.js"; // Metodos de crear y listar usuarios

// Inicializacion de rutas de express
const router = Router();

// Rutas  de usuarios
router.post("/usuarios", createUserRules, validate, createUser); // Post para crear usuario
router.get("/usuarios", listUsersRules, validate, listUsers); // Para obterner usuarios

// Exportamos todas las turas en routes
export default router;
