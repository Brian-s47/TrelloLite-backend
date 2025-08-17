// dataset.js (ESM) — TrelloLite seeds (usuarios, tableros, tareas)
// Ejecuta: node dataset.js
// Requiere en .env: DB_URI, DB_NAME

import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";

// ========= Config =========
const uri = process.env.DB_URI;
const dbName = process.env.DB_NAME || "trellolite_dev";
if (!uri) throw new Error("Falta DB_URI en .env");

// Normalización básica (emails/strings claves)
const norm = (s) => (s ?? "").toString().trim().toLowerCase();

// ========= Datos de prueba (realistas) =========

// 1) Usuarios (email único)
const USERS = [
  { nombre: "Brian Suarez",  email: "brian.suarez@example.com" },
  { nombre: "Ana Torres",    email: "ana.torres@example.com" },
  { nombre: "Carlos Gómez",  email: "carlos.gomez@example.com" },
];

// 2) Tableros (nombre único; miembros por email)
const BOARDS = [
  {
    nombre: "Web Pública",
    descripcion: "Sitio público y landing",
    ownerEmail: "brian.suarez@example.com",
    memberEmails: [
      "brian.suarez@example.com",
      "ana.torres@example.com"
    ],
  },
  {
    nombre: "App Interna",
    descripcion: "Panel administrativo interno",
    ownerEmail: "ana.torres@example.com",
    memberEmails: [
      "ana.torres@example.com",
      "carlos.gomez@example.com"
    ],
  },
  {
    nombre: "Marketing",
    descripcion: "Campañas y contenidos",
    ownerEmail: "carlos.gomez@example.com",
    memberEmails: [
      "carlos.gomez@example.com",
      "brian.suarez@example.com"
    ],
  },
];

// 3) Tareas (referencian board por nombre y responsable por email)
const TASKS = [
  {
    boardName: "Web Pública",
    titulo: "Diseñar logo",
    descripcion: "Propuesta inicial del logo para landing",
    fechaLimite: "2025-08-25T23:59:59.000Z",
    responsableEmail: "brian.suarez@example.com",
    estado: "pendiente",
  },
  {
    boardName: "Web Pública",
    titulo: "Maquetar home",
    descripcion: "Sección hero, features y CTA",
    fechaLimite: "2025-08-22T23:59:59.000Z",
    responsableEmail: "ana.torres@example.com",
    estado: "en_progreso",
  },
  {
    boardName: "App Interna",
    titulo: "Implementar /api/tasks",
    descripcion: "CRUD completo con validaciones",
    fechaLimite: "2025-08-21T23:59:59.000Z",
    responsableEmail: "ana.torres@example.com",
    estado: "pendiente",
  },
  {
    boardName: "App Interna",
    titulo: "Configurar roles",
    descripcion: "Definir permisos por vista",
    fechaLimite: "2025-08-28T23:59:59.000Z",
    responsableEmail: "carlos.gomez@example.com",
    estado: "pendiente",
  },
  {
    boardName: "Marketing",
    titulo: "Calendario de posts",
    descripcion: "Plan de contenidos 2 semanas",
    fechaLimite: "2025-08-24T23:59:59.000Z",
    responsableEmail: "carlos.gomez@example.com",
    estado: "pendiente",
  },
  {
    boardName: "Marketing",
    titulo: "Creatividades campaña",
    descripcion: "Piezas para redes y display",
    fechaLimite: "2025-08-27T23:59:59.000Z",
    responsableEmail: "brian.suarez@example.com",
    estado: "pendiente",
  },
];

// ========= Seed principal =========
async function seed() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const Usuarios = db.collection("usuarios");
  const Tableros = db.collection("tableros");
  const Tareas   = db.collection("tareas");

  // Índices (crear si no existen)
  await Usuarios.createIndex(
    { email: 1 },
    { unique: true, collation: { locale: "es", strength: 2 } }
  );
  await Tableros.createIndex(
    { nombre: 1 },
    { unique: true, collation: { locale: "es", strength: 2 } }
  );
  await Tareas.createIndex({ boardId: 1 });
  await Tareas.createIndex({ responsableId: 1 });
  await Tareas.createIndex({ estado: 1, fechaLimite: 1 });

  const now = new Date();

  // 1) Upsert Usuarios
  const userIdByEmail = new Map();
  for (const u of USERS) {
    const email = norm(u.email);

    const resUser = await Usuarios.findOneAndUpdate(
      { email },
      {
        $set: { nombre: u.nombre.trim(), email, updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true, returnDocument: "after", collation: { locale: "es", strength: 2 } }
    );

    const userDoc = resUser?.value || (await Usuarios.findOne({ email }, { collation: { locale: "es", strength: 2 } }));
    if (!userDoc) throw new Error(`No se pudo upsert el usuario: "${email}"`);
    userIdByEmail.set(email, userDoc._id);
  }

  // 2) Upsert Tableros (miembros -> ids a partir de emails)
  const boardIdByName = new Map();
  for (const b of BOARDS) {
    const nameKey = b.nombre.trim();
    const ownerId = userIdByEmail.get(norm(b.ownerEmail));
    if (!ownerId) throw new Error(`Owner no encontrado para tablero "${nameKey}"`);

    const miembros = (b.memberEmails || []).map((e) => {
      const id = userIdByEmail.get(norm(e));
      if (!id) throw new Error(`Miembro no encontrado: "${e}" en tablero "${nameKey}"`);
      return id;
    });

    // Asegura que el owner esté entre los miembros
    if (!miembros.some((id) => id.equals?.(ownerId))) miembros.unshift(ownerId);

    const resBoard = await Tableros.findOneAndUpdate(
      { nombre: nameKey },
      {
        $set: {
          nombre: nameKey,
          descripcion: b.descripcion?.trim() || "",
          miembros,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true, returnDocument: "after", collation: { locale: "es", strength: 2 } }
    );

    const boardDoc = resBoard?.value || (await Tableros.findOne({ nombre: nameKey }, { collation: { locale: "es", strength: 2 } }));
    if (!boardDoc) throw new Error(`No se pudo upsert el tablero: "${nameKey}"`);
    boardIdByName.set(nameKey.toLowerCase(), boardDoc._id);
  }

  // 3) Upsert Tareas (por par: boardId + titulo) — versión robusta
  let tasksUpserted = 0;
  const ESTADOS = new Set(["pendiente", "en_progreso", "completada"]);

  for (const t of TASKS) {
    const boardId = boardIdByName.get(t.boardName.trim().toLowerCase());
    if (!boardId) throw new Error(`Tablero no encontrado para tarea "${t.titulo}" (board: ${t.boardName})`);

    const responsableId = userIdByEmail.get((t.responsableEmail ?? "").trim().toLowerCase());
    if (!responsableId) throw new Error(`Responsable no encontrado: "${t.responsableEmail}" en tarea "${t.titulo}"`);

    // Validar estado
    const estado = t.estado ?? "pendiente";
    if (!ESTADOS.has(estado)) throw new Error(`Estado inválido "${estado}" en tarea "${t.titulo}"`);

    const filter = { boardId, titulo: t.titulo.trim() };

    // Upsert garantizado
    await Tareas.updateOne(
      filter,
      {
        $set: {
          boardId,
          titulo: t.titulo.trim(),
          descripcion: t.descripcion?.trim() || "",
          fechaLimite: new Date(t.fechaLimite),
          responsableId,
          estado,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );

    // Lectura posterior para confirmar que el doc existe
    const doc = await Tareas.findOne(filter);
    if (!doc) {
      throw new Error(`No se pudo upsert la tarea (lectura fallida): "${t.titulo}"`);
    }

    tasksUpserted += 1;
  }


  // 4) Resumen
  const [uCount, bCount, tCount] = await Promise.all([
    Usuarios.countDocuments(),
    Tableros.countDocuments(),
    Tareas.countDocuments(),
  ]);

  console.log("✅ Seed completado");
  console.table({
    "Usuarios (total)": uCount,
    "Tableros (total)": bCount,
    "Tareas (total)": tCount,
    "Tareas upsert en esta corrida": tasksUpserted,
  });

  await client.close();
}

// Ejecutar
seed().catch((err) => {
  console.error("❌ Error en seed:", err);
  process.exit(1);
});
