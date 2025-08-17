// Zona de importacion de modulos
import { Router } from "express"; // rutas de express
import { validate } from "../middlewares/validate.js"; // Validator-express
import { createTablerosRules, listTablerosRules, deleteTableroRules, getTableroByIdRules, updateTableroRules } from "./tableros.rules.js"; // Modulos valitador express
import { createTablero, listTableros, deleteTablero, getTableroById, updateTablero } from "../controllers/tableros.controller.js"; // Metodos de crear y listar tableros

// Inicializacion de rutas de express
const router = Router();

// Rutas de Tableros
router.post("/tableros", createTablerosRules, validate, createTablero); // Post para crear tablero
router.get("/tableros", listTablerosRules, validate, listTableros); // Para obterner tableros
router.delete("/tableros/:id", deleteTableroRules, validate, deleteTablero); // Para borrar un tablero por id (Cascada Taras asosiadas)
router.get("/tableros/:id", getTableroByIdRules, validate, getTableroById); // Para obterner tablero por id
router.put("/tableros/:id", updateTableroRules, validate, updateTablero); // Para actualizar tablero por id con PUT
router.patch("/tableros/:id", updateTableroRules, validate, updateTablero); // Para actualizar tablero por id con patch

// Exportamos todas las turas en routes
export default router;