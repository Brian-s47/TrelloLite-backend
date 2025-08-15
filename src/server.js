// Zona de importacion de Modulos
import dotenv from 'dotenv'; // Para manejo de varibles de entorno
import app from './app.js'; // Importa la configuración de la app Express
import { connect, disconnect } from './config/db.js'; // Funciones para conectar y desconectar de MongoDB

// Inicializamos Dotenv
dotenv.config();

// Inicializacion de variables par Servidor de APP
const PORT = process.env.PORT || 3000;// Inicializamos puerto o si no lo encuentra por defecto 3000

// Función principal para iniciar el servidor
const start = async () => {
  await connect(); // Esperar a que conecte
  const server = app.listen(PORT, () => { // Iniciar el servidor de Express
    console.log(`🚀 Servidor en http://localhost:${PORT}/api`);
  });

  //Función para apagado limpio (graceful shutdown)
  const gracefulShutdown = async (signal) => { 
    console.log(`\n↩️  Señal recibida: ${signal}. Cerrando...`);
    server.close(async () => { // Detiene el servidor para no aceptar más solicitudes
      await disconnect(); // Cierra la conexión a la base de datos
      process.exit(0); // Finaliza el proceso de Node 
    });
  };
  // Captura señales del sistema para apagar de forma segura
  process.on('SIGINT', gracefulShutdown);   // Ctrl+C
  process.on('SIGTERM', gracefulShutdown);  // Cuando el sistema envía señal de terminar
};

// Llamada a la función principal
start();
