// Zona de importacion de modulos
import { ObjectId } from "mongodb"; // Modulo para crar ID de mongoDB

// Creacion de Clase Usuario
export class Usuario{
    // Contructor definicion de atribbutos
    constructor({_id, nombre, email, createdAt, updatedAt}){
        this._id = _id ? new ObjectId(_id) : undefined; // id si si tiene convertirlo a obget Id si no undefine
        this.nombre = nombre?.trim(); // nombre se quitan espacios al inicio y al final
        this.email = email?.trim().toLowerCase(); // email se quitan espacios al inicio y al final y se pasa todo a minuscula
        this.createdAt = createdAt ? new Date(createdAt) : new Date(); // si se envia la fecha de creacion se convierte a fecha si no se pone fecha actual
        this.updatedAt = updatedAt ? new Date(updatedAt) : new Date(); // si se envia la fecha de actualizacio se convierte a fecha si no se pone fecha actual
    }
    // Metodo para convertir a obgeto plado para incertar o actulizar en MongoDB
    toDocument() {
        return {
            ...(this._id && { _id: this._id }), // Si trae un _id incluir en documento si no, no ponerlos
            // Validacion de corfmato correcto de atributos
            nombre: this.nombre,
            email: this.email,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
    // Metodo que recibe un objeto plano de mongo BD a una instancia de la clase Usuario
    static fromDocument(doc) { // Es estatico porque no requiere tener una estancia de al clase para usarlo
        if (!doc) return null;
        return new Usuario(doc);
    }
    // Metodo validador de campos
    validar() {
        // Validacion de nombre de timpo string
        if (!this.nombre || typeof this.nombre !== "string") {
            throw new Error("nombre inválido");
        }
        // Validacion de Email 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i; // que cumpla con expresion regular
        if (!this.email || !emailRegex.test(this.email)) {
            throw new Error("email inválido");
        }
    }
}