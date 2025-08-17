// Zona de importaciones 
import { MongoClient } from "mongodb"; // Modulo para MongoDB
import dotenv from 'dotenv'; // Para manejo de varibles de entorno

// Inicializamos Dotenv
dotenv.config();

// Inicializamos variables de entorno
const uri = process.env.DB_URI;
const nombreDB = process.env.DB_NAME

//Inicializamos Cliente de mongoDB
const client = new MongoClient(uri);

// Inicializamos variable para almecenar BD
let db;

// Funcion para ejecutare conexion
export async function connect(){
    try{
        await client.connect();
        db = client.db(nombreDB);
        console.log(`✅ Conexion Correcta a DB:${nombreDB}`);
    } catch(error)
    {
        console.log(`❌Error al conectar a la DB con nombre:${nombreDB} y uri:${uri}`, error.message);
        process.exit(1); // 
    }
};

// Funcion para obtener la DB
export function getDB() {
    if(!db){
        throw new Error(`La DB con nombre:${nombreDB} no está inicializada.`);
    }
    return db;
};

// Funcion para desconexion de DB
export async function disconnect() {
  try {
    await client.close();
    console.log('👋 Conexion a MongoDB cerrada.');
  } catch (error) {
    console.error('Error al cerrar MongoDB:', error.message);
  }
}