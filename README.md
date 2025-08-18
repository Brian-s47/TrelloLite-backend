# 📌 TrelloLite - Backend


**TrelloLite** es una aplicación web **Full Stack** para la gestión de tareas en equipos pequeños.  
Permite crear, asignar y actualizar tareas con estados personalizados (`pendiente`, `en_progreso`, `completada`).  

Incluye:
- Backend en **Node.js + Express** con **MongoDB** (Driver oficial).
- Frontend que muestra un tablero visual, filtros por estado y cambio dinámico del estado de las tareas.

> Este repositorio contiene **únicamente** el backend de la aplicación.  
> El frontend se desarrolla en un repositorio separado.

---

## 📂 Estructura de Carpetas


---

## 📂 Estructura de Carpetas (fase inicial)
```
TRELLOLITE-BACKEND/
├─ src/
│ ├─ config/ # Configuración (DB, env)
│ ├─ controllers/ # Lógica de negocio (usuarios, tableros, tareas)
│ ├─ middlewares/ # Middlewares (errores, validaciones)
│ ├─ models/ # Clases de dominio (Usuario, Tarea, Tablero)
│ ├─ routes/ # Definición de endpoints
│ ├─ utils/ # Helpers y respuestas estandarizadas
│ ├─ app.js # Configuración de Express
│ └─ server.js # Arranque del servidor
├─ .env # Variables de entorno
├─ package.json
└─ README.md
```

---

## ⚙️ Tecnologías usadas

- [Node.js](https://nodejs.org/) - Entorno de ejecución JavaScript
- [Express](https://expressjs.com/) - Framework para servidor HTTP
- [MongoDB Driver Oficial](https://www.mongodb.com/docs/drivers/node/current/) - Conexión y consultas a MongoDB
- [Dotenv](https://github.com/motdotla/dotenv) - Manejo de variables de entorno
- [Nodemon](https://nodemon.io/) - Recarga automática en desarrollo
- [Cors](https://www.npmjs.com/package/cors) - Middleware para habilitar solicitudes desde distintos orígenes

---

## 📦 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/Brian-s47/TrelloLite-backend
cd TrelloLite-backend

```
2. Instalar dependencias:
```bash
npm install
```
3. Configurar variables de entorno en un archivo .env:
```bash
PORT=5500
DB_URI=mongodb://localhost:27017
DB_NAME=TrelloLite
```

🚀 Ejecución
**Modo desarrollo (con recarga automática):**
```bash
npm run dev
```
**Modo producción:**
```bash
npm start
```
**El servidor se levantará en:**
```bash
http://localhost:5500/api
```
---
🌍 CORS
✅ **Endpoints disponibles (fase inicial)**

Se resolvió el problema de CORS (Cross-Origin Resource Sharing) utilizando el middleware oficial cors de Express:
- Healthcheck

```bash
import cors from "cors";
app.use(cors());

```
- Esto permite que el frontend (aunque se ejecute en otro puerto u origen, por ejemplo http://localhost:5173) pueda consumir la API sin restricciones.
En caso de despliegue, se puede configurar para permitir solo dominios específicos.
---
GET /api
Respuesta:
```bash
"API corriendo correctamente"
```

- **Diseño de dominio**

### usuarios 

**Propósito:** quién crea/asigna tareas.

- `_id` (ObjectId)
- `nombre` → (string, req)
- `email` → (string, req, único)
- `createdAt`, `updatedAt` → (Date)

**Ejemplo:**
```bash
{
  "_id": "66c21fae6a5b1d9b8a000001",
  "nombre": "Brian Suarez",
  "email": "brian@example.com",
  "createdAt": "2025-08-15T00:00:00.000Z",
  "updatedAt": "2025-08-15T00:00:00.000Z"
}
```
---

### tareas

**Propósito:** Nucleo de trabajo lo que trata de gestionar la APP

- `_id` (ObjectId)
- `boardId` → referencia a tablero._id
- `titulo` → (string, req)
- `descripcion` → (string, req)
- `fechaLimite` → (Date, req)
- `responsableId` → referencia a usuario._id
- `estado` (string enum: pendiente, en_progreso, completada; default: pendiente)
- `createdAt`, `updatedAt`→ (Date)

**Ejemplo:**
```bash
{
  "_id": "66c2220a6a5b1d9b8a000120",
  "boardId": "66c2215f6a5b1d9b8a000100",
  "titulo": "Diseñar logo",
  "descripcion": "Propuesta inicial",
  "fechaLimite": "2025-08-25T00:00:00.000Z",
  "responsableId": "66c21fae6a5b1d9b8a000001",
  "estado": "pendiente",
  "createdAt": "2025-08-15T12:15:00.000Z",
  "updatedAt": "2025-08-15T12:15:00.000Z"
}
```
---

### tableros

**Propósito:** agrupar tareas por proyecto/board (como Trello).

- `_id` (MongoDB)
- `nombre` → (req)
- `descripcion` → (req)
- `miembros` -> (array de userIds)
- `createdAt`, `updatedAt`→ (Date)

**Ejemplo:**
```bash
{
  "_id": "66c2215f6a5b1d9b8a000100",
  "nombre": "Web Pública",
  "descripcion": "Tablero del sitio",
  "miembros": ["66c21fae6a5b1d9b8a000001"],
  "createdAt": "2025-08-15T12:05:00.000Z",
  "updatedAt": "2025-08-15T12:05:00.000Z"
}
```
**Nota:** La idea de noegocio y logica comprende el que se tiene muchos usuarios cualquiera puede crear un tablero y quedaria como responsable y agregaria colaboradores, 
al crear una tarea tendra un colaborador asignao y se le asignara el Id el tablero para de esa manera ir gestionando las tareas sus estados y resposables.

- **🔗 Relaciones de dominio (ERD)**
```bash
    USUARIOS ||--o{ TABLEROS : crea
    USUARIOS ||--o{ TAREAS : responsable
    TABLEROS ||--o{ TAREAS : contiene

    USUARIOS {
      string _id
      string nombre
      string email
      date createdAt
      date updatedAt
    }

    TABLEROS {
      string _id
      string nombre
      string descripcion
      array miembros
      date createdAt
      date updatedAt
    }

    TAREAS {
      string _id
      string titulo
      string descripcion
      string estado
      date fechaLimite
      date createdAt
      date updatedAt
    }
``` 
---
   📌 Respuestas estandarizadas

Todas las respuestas siguen este formato uniforme:

✅ Éxito:
```bash
{
  "data": { ... },
  "meta": { "total": 5 }
}
```
```bash
{
  "error": "NOT_FOUND",
  "message": "Usuario no encontrado"
}
```
---

## 🔗 Documentacion API

- Para ver toda la documentacion de la API ingrese al siguiente Link : <https://documenter.getpostman.com/view/27104424/2sB3BHnVGP>

---
**🚀 Mejoras futuras**

- Implementar autenticación con JWT.
- Agregar roles de usuario (admin, miembro).
- Filtrar tareas por estado/fecha límite.
- Respuestas más detalladas en eliminaciones (delete).
