// Zona de importacion de modulos
import { Router } from 'express'; // Modulo para crear rutas con express
import { getDB } from '../config/db.js'; // Modulo para traer la DB


// Inicializamos el gestor de Rutas
const router = Router();

// Ruta de prueba para incertar un dato en DB
router.post('/test-db', async (req, res) => {
    try{
        // Traer la DB
        const db = getDB();
        // Creamos objeto que vamos a insertar
        const { titulo = 'Tarea demo', responsable = 'anon', fechaLimite = new Date().toISOString() } = req.body || {};
        const nueva = {
            titulo,
            descripcion: "Creada desde /api/test-db",
            responsable,
            fechaLimite: new Date(fechaLimite),
            estado: 'pendiente',
            createAt: new Date()
        };
        // Inicializamos respuesta
        const result = await db.collection('tasks').insertOne(nueva);
        return res.status(201).json({ ok: true, insertId: result.insertId});
    }catch(error){
        console.error('Error en test-db:', error.message);
        return res.status(500).json({ ok: false, error: 'No se pudo insertar en DB' });
    };
});

// Exportamos router para gestion de rutas
export default router;

