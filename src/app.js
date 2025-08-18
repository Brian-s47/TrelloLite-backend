// Zona de importacion de modulos 
import express from "express"; // Libreria de express
import cors from "cors"; // Solcuion de CORS = Cross-Origin Resource Sharing (Compartición de recursos entre orígenes).
import usuariosRouter from './router/usuarios.routes.js'; // Rutas de clase usuarios
import tablerosRouter from './router/tableros.routes.js'; // Rutas de clase tableros
import tareasRouter from './router/tareas.router.js'; // Rutas de clase tareas
import { errorHandler } from "./middlewares/error.js"; // Middleware para manejo global de errores

const app = express(); // Inicializacion de App con express

// Middlewares de interpretacion de JSON
app.use(express.json());
// Habilita CORS para cualquier origen
app.use(cors());

// EndPoint de conexion con la API
app.get("/api", (req, res) => {
    res.status(200).send("API corriendo correctamente");
});

// Rutas de usuarios
app.use("/api", usuariosRouter);
// Rutas de tableros
app.use("/api", tablerosRouter);
// Rutas de tareas
app.use("/api", tareasRouter);

// Middleware para 404
app.use((req, res, next) => {
  res.status(404).json({
    error: {
      message: "Recurso no encontrado",
    },
  });
});
// Usar el manejo de errores global
app.use(errorHandler);

// Exportamos APP
export default app;
