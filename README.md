# 📌 TrelloLite - Backend

**TrelloLite** es una aplicación web **Full Stack** para la gestión de tareas en equipos pequeños.  
Permite crear, asignar y actualizar tareas con estados personalizados (`pendiente`, `en progreso`, `completada`).  

Incluye:
- Backend en **Node.js + Express** con **MongoDB** (Driver oficial).
- Frontend que muestra un tablero visual, filtros por estado y cambio dinámico del estado de las tareas.

> Este repositorio contiene **únicamente** el backend de la aplicación.  
> El frontend se desarrolla en un repositorio separado.

---

## 📂 Estructura de Carpetas (fase inicial)
```
TRELLOLITE-BACKEND/
├─ src/
│ ├─ config/
│ │ └─ db.js # Configuración y conexión a MongoDB (driver oficial)
│ ├─ router/
│ │ └─ test.routes.js # Endpoint temporal para probar conexión a la DB
│ ├─ app.js # Configuración de Express y middlewares
│ └─ server.js # Punto de entrada: conexión a DB y arranque del servidor
├─ .env # Variables de entorno (no versionar)
├─ .gitignore
├─ package.json
├─ package-lock.json
└─ README.md
```

---

## ⚙️ Tecnologías usadas

- [Node.js](https://nodejs.org/) - Entorno de ejecución JavaScript
- [Express](https://expressjs.com/) - Framework para servidor HTTP
- [MongoDB Driver Oficial](https://www.mongodb.com/docs/drivers/node/current/) - Conexión y consultas a MongoDB
- [Dotenv](https://github.com/motdotla/dotenv) - Manejo de variables de entorno
- [Nodemon](https://nodemon.io/) - Recarga automática en desarrollo

---

## 📦 Instalación

1. Clonar el repositorio:
```bash
git clone <https://github.com/Brian-s47/TrelloLite-backend>
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

✅ **Endpoints disponibles (fase inicial)**
- Healthcheck

GET /api
Respuesta:
```bash
"API corriendo correctamente"
```