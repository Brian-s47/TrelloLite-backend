// Zona de importacion de modulos
import { Router } from "express"; // rutas de express
import { validate } from "../middlewares/validate.js"; // Validator-express
import { createTareasRules, listTareasRules, deleteTareaRules } from "./tareas.rules.js"; // Modulos valitador express
import { createTarea, listTareas, deleteTarea } from "../controllers/tareas.controller.js"; // Metodos de crear y listar tareas

// Inicializacion de rutas de express
const router = Router();

// Rutas de Tareas
router.post("/tareas", createTareasRules, validate, createTarea); // Post para crear tarea
router.get("/tareas", listTareasRules, validate, listTareas); // Para obterner tarea
router.delete("/tareas/:id", deleteTareaRules, validate, deleteTarea); // Para Borrar tarea

// Exportamos todas las turas en routes
export default router;