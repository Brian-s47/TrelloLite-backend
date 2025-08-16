// Creacion de Clase Tablero
import { ObjectId } from 'mongodb';

export class Tablero {
    // Contructor definicion de atribbutos
    constructor({ _id, nombre, descripcion, miembros = [], createdAt, updatedAt }) {
        this._id = _id ? new ObjectId(_id) : undefined;// id si si tiene convertirlo a obget Id si no undefine
        this.nombre = nombre?.trim();// nombre se quitan espacios al inicio y al final
        this.descripcion = (descripcion ?? '').trim();//si no trae descripcion inserta vacio y quitamos los espacion al inicio y al final
        this.miembros = miembros.map(id => new ObjectId(id));// Mapeamos y sacamos los Id de los mimebos ingresados y los convertimos a objeto Id reconocible lpara mongoDB
        this.createdAt = createdAt ? new Date(createdAt) : new Date();// si se envia la fecha de creacion se convierte a fecha si no se pone fecha actual
        this.updatedAt = updatedAt ? new Date(updatedAt) : new Date();// si se envia la fecha de actualizacio se convierte a fecha si no se pone fecha actual
    }
    // Metodo para convertir a obgeto plado para incertar o actulizar en MongoDB
    toDocument() {
        return {
        ...(this._id && { _id: this._id }),
        nombre: this.nombre,
        descripcion: this.descripcion,
        miembros: this.miembros,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        };
    }
    // Metodo que recibe un objeto plano de mongo BD a una instancia de la clase Usuario
    static fromDocument(doc) {// Es estatico porque no requiere tener una estancia de al clase para usarlo
        if (!doc) return null;
            return new Tablero(doc);
    }
    // Metodo validador de campos
    validar() {
        // nombre requerido string no vacío
        if (!this.nombre || typeof this.nombre !== "string") {
        throw new Error("nombre requerido/ inválido");
        }
        // descripcion requerida string no vacía (según tu dominio la marcaste req)
        if (!this.descripcion || typeof this.descripcion !== "string") {
        throw new Error("descripcion requerida/ inválida");
        }
        // miembros debe ser array de ObjectId
        if (!Array.isArray(this.miembros) || this.miembros.some((m) => !(m instanceof ObjectId))) {
        throw new Error("miembros debe ser un array de ObjectId");
        }
    }
}
