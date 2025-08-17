// Zona de importacion de modulos
import { Router } from "express"; // rutas de express
import { validate } from "../middlewares/validate.js"; // Validator-express
import { createTareasRules, listTareasRules, deleteTareaRules, getTareaByIdRules, updateEstadoRules, updateTareaRules } from "./tareas.rules.js"; // Modulos valitador express
import { createTarea, listTareas, deleteTarea, getTareaById, updateEstadoTarea, updateTarea } from "../controllers/tareas.controller.js"; // Metodos de crear y listar tareas

// Inicializacion de rutas de express
const router = Router();

// Rutas de Tareas
router.post("/tareas", createTareasRules, validate, createTarea); // Post para crear tarea
router.get("/tareas", listTareasRules, validate, listTareas); // Para obterner tareas
router.delete("/tareas/:id", deleteTareaRules, validate, deleteTarea); // Para Borrar tarea
router.get("/tareas/:id", getTareaByIdRules, validate, getTareaById); // Para obteenr una tarea por ID
router.patch("/tareas/:id/estado", updateEstadoRules, validate, updateEstadoTarea);// Para Actualizar estado de una tarea
router.put("/tareas/:id", updateTareaRules, validate, updateTarea); // Para actualizar atributos de una tarea con PUT 
router.patch("/tareas/:id", updateTareaRules, validate, updateTarea); // Para actualizar atributos de una tarea con PATCH 

// Exportamos todas las turas en routes
export default router;