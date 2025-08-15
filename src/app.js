// Zona de importacion de modulos 
import express from "express"; // Libreria de express
import testRouter from './router/test.routes.js'; // ruta para test incial

const app = express(); // Inicializacion de App con express

// Middlewares de interpretacion de JSON
app.use(express.json());

// EndPoint de conecion con la API
app.get("/api", (req, res) => {
    res.status(200)(`Api Corriendo correctamente`)
});

// 👇 Monta la ruta temporal
app.use('/api', testRouter);

// Exportamos APP
export default app;
