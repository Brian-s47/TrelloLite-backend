// Zona de importacion de modulos
import { Router } from "express"; // rutas de express
import { validate } from "../middlewares/validate.js"; // Validator-express
import { createTablerosRules, listTablerosRules, deleteTableroRules } from "./tableros.rules.js"; // Modulos valitador express
import { createTablero, listTableros, deleteTablero } from "../controllers/tableros.controller.js"; // Metodos de crear y listar tableros

// Inicializacion de rutas de express
const router = Router();

// Rutas de Tableros
router.post("/tableros", createTablerosRules, validate, createTablero); // Post para crear tablero
router.get("/tableros", listTablerosRules, validate, listTableros); // Para obterner tableros
router.delete("/tableros/:id", deleteTableroRules, validate, deleteTablero); // Para borrar un tablero por id (Cascada Taras asosiadas)

// Exportamos todas las turas en routes
export default router;