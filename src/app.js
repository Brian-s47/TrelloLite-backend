// Zona de importacion de modulos 
import express from "express"; // Libreria de express
import usuariosRouter from './router/usuarios.routes.js'; // Rutas de clase usuarios
import tablerosRouter from './router/tableros.routes.js'; // Rutas de clase tableros
import tareasRouter from './router/tareas.router.js'; // Rutas de clase tareas

const app = express(); // Inicializacion de App con express

// Middlewares de interpretacion de JSON
app.use(express.json());

// EndPoint de conexxion con la API
app.get("/api", (req, res) => {
    res.status(200)(`Api Corriendo correctamente`)
});

// Rutas de usuarios
app.use("/api", usuariosRouter);
// Rutas de tableros
app.use("/api", tablerosRouter);
// Rutas de tareas
app.use("/api", tareasRouter);

// Exportamos APP
export default app;
