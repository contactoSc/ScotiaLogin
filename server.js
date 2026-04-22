const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Simulación de usuarios en BD
const users = [
  { user: 'pedro', passwordHash: bcrypt.hashSync('clave123', 10) }
];

app.post('/api/login', (req, res) => {
  const { user, password } = req.body;
  const found = users.find(u => u.user === user);

  if (found && bcrypt.compareSync(password, found.passwordHash)) {
    res.json({ success: true, message: 'Login exitoso. Bienvenido.' });
  } else {
    res.json({ success: false, message: 'Usuario o clave incorrectos.' });
  }
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
