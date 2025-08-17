// Zona de importacion de modulos
import { ObjectId } from "mongodb"; // Modulo para crar ID de mongoDB
import { DateTime } from "luxon"; // Libreria para manejo de fechas

// Array de estados para validacion al crear
const ESTADOS = new Set(['pendiente', 'en_progreso', 'completada']); // creamos coleccion de valores unicos para validacion de atributo estado

// Creacion de Clase Tarea
export class Tarea{
    // Contructor definicion de atribbutos
    constructor({ _id, titulo, boardId, createdAt, descripcion, estado = 'pendiente', fechaLimite, responsableId, updatedAt}){
        this._id = _id ? new ObjectId(_id) : undefined; // id si si tiene convertirlo a obget Id si no undefine
        this.titulo = titulo?.trim(); // titulo se quitan espacios al inicio y al final
        this.boardId = new ObjectId(boardId); // convertimos el id a obgeto ID reconocido por Mongo DB
        this.createdAt = createdAt ? new Date(createdAt) : new Date(); // si se envia la fecha de creacion se convierte a fecha si no se pone fecha actual
        this.descripcion = (descripcion ?? '').trim(); //si no trae descripcion inserta vacio y quitamos los espacion al inicio y al final
        this.estado = ESTADOS.has(estado) ? estado : 'pendiente'; // seteamos estado si es valido TRU agrega estado false pone pendiente
        this.fechaLimite = new Date(fechaLimite); // convertimos a formato de fecha
        this.responsableId = new ObjectId(responsableId); // convertimos el id a obgeto ID reconocido por Mongo DB
        this.updatedAt = updatedAt ? new Date(updatedAt) : new Date(); // si se envia la fecha de actualizacio se convierte a fecha si no se pone fecha actual
    }
    // Zona de creacion de metodos
    // Metodo que recibe un obbjeto plado de mongo BD a una instancia de la clase Usuario
    toDocument() {
        return {
            ...(this._id && { _id: this._id }),
            // Validacion de formato correcto de atributos
            titulo: this.titulo,
            boardId: this.boardId,
            createdAt: this.createdAt,
            descripcion: this.descripcion,
            estado: this.estado,
            fechaLimite: this.fechaLimite,
            responsableId: this.responsableId,
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
        // fechaLimite: debe ser Date válido
        if (!(this.fechaLimite instanceof Date) || isNaN(+this.fechaLimite)) {
        throw new Error("fechaLimite inválida (usa formato AAAA-MM-DD)");
        }
        // Validar que sea una fecha real (evitar 2025-02-31).
        // Como aquí ya es Date, comprobamos reconstruyendo YYYY-MM-DD:
        const y = this.fechaLimite.getUTCFullYear();
        const m = this.fechaLimite.getUTCMonth() + 1;
        const d = this.fechaLimite.getUTCDate();
        const reconstructed = new Date(Date.UTC(y, m - 1, d));
        const sigueSiendoIgual =
        reconstructed.getUTCFullYear() === y &&
        reconstructed.getUTCMonth() === (m - 1) &&
        reconstructed.getUTCDate() === d;
        if (!sigueSiendoIgual) throw new Error("fechaLimite no corresponde a una fecha válida");

        // Validacion de fecha no anterior a hoy
        if (!(this.fechaLimite instanceof Date) || isNaN(+this.fechaLimite)) {
            throw new Error("fechaLimite inválida (usa formato AAAA-MM-DD)");
        }
        const deadline = DateTime.fromJSDate(this.fechaLimite, { zone: "America/Bogota" });
        if (!deadline.isValid) {
            throw new Error("fechaLimite no corresponde a una fecha válida");
        }
        const now = DateTime.now().setZone("America/Bogota");
        if (deadline < now.startOf("day")) {
            throw new Error("fechaLimite no puede estar en el pasado");
        }
        if (!ESTADOS.has(this.estado)) {
            throw new Error("estado inválido (use: pendiente | en_progreso | completada)");
        }
    }
}


