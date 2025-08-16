// Zona de importacion de modulos
import { ObjectId } from "mongodb"; // Modulo para crar ID de mongoDB

// Array de estados para validacion al crear
const ESTADOS = new Set(['pendiente', 'en_progreso', 'completada']); // creamos coleccion de valores unicos para validacion de atributo estado

// Creacion de Clase Tarea
export class Tarea{
    // Contructor definicion de atribbutos
    constructor({ _id, boardId, titulo, descripcion, fechaLimite, responsableId, estado = 'pendiente', createdAt, updatedAt}){
        this._id = _id ? new ObjectId(_id) : undefined; // id si si tiene convertirlo a obget Id si no undefine
        this.boardId = new ObjectId(boardId); // convertimos el id a obgeto ID reconocido por Mongo DB
        this.titulo = titulo?.trim(); // titulo se quitan espacios al inicio y al final
        this.descripcion = (descripcion ?? '').trim(); //si no trae descripcion inserta vacio y quitamos los espacion al inicio y al final
        this.fechaLimite = new Date(fechaLimite); // convertimos a formato de fecha
        this.responsableId = new ObjectId(responsableId); // convertimos el id a obgeto ID reconocido por Mongo DB
        this.estado = ESTADOS.has(estado) ? estado : 'pendiente'; // seteamos estado si es valido TRU agrega estado false pone pendiente
        this.createdAt = createdAt ? new Date(createdAt) : new Date(); // si se envia la fecha de creacion se convierte a fecha si no se pone fecha actual
        this.updatedAt = updatedAt ? new Date(updatedAt) : new Date(); // si se envia la fecha de actualizacio se convierte a fecha si no se pone fecha actual
    }
    // Zona de creacion de metodos
    // Metodo que recibe un obbjeto plado de mongo BD a una instancia de la clase Usuario
    toDocument() {
        return {
            ...(this._id && { _id: this._id }),
            // Validacion de formato correcto de atributos
            boardId: this.boardId,
            titulo: this.titulo,
            descripcion: this.descripcion,
            fechaLimite: this.fechaLimite,
            responsableId: this.responsableId,
            estado: this.estado,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
    // Metodo que recibe un objeto plano de mongo BD a una instancia de la clase Tarea
    static fromDocument(doc) { // Es estatico porque no requiere tener una estancia de al clase para usarlo
        if (!doc) return null;
        return new Tarea(doc);
    }
    validar() {
        // boardId / responsableId deben ser ObjectId válidos (ya convertidos)
        if (!(this.boardId instanceof ObjectId)) {
        throw new Error("boardId inválido");
        }
        // ide dresponsable debe ser estancia de ObjectId
        if (!(this.responsableId instanceof ObjectId)) {
        throw new Error("responsableId inválido");
        }
        // titulo requerido string no vacío
        if (!this.titulo || typeof this.titulo !== "string") {
        throw new Error("titulo requerido/ inválido");
        }
        // descripcion requerida string no vacía (según tu dominio)
        if (!this.descripcion || typeof this.descripcion !== "string") {
        throw new Error("descripcion requerida/ inválida");
        }
        // fechaLimite válida (Date no inválida)
        if (!(this.fechaLimite instanceof Date) || isNaN(this.fechaLimite)) {
        throw new Error("fechaLimite inválida (usa formato ISO 8601)");
        }
        // estado válido
        if (!ESTADOS.has(this.estado)) {
        throw new Error("estado inválido (use: pendiente | en_progreso | completada)");
        }
    }
}


