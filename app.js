const express = require('express');
const app = express();
const port = 8010;
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const { v4: uuidv4 } = require('uuid');

const dbConfig = {
    user: 'PRM',
    password: 'a.123456',
    connectString: 'pablo-note:1521/xe'
  };

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Ruta para servir el formulario HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Ruta para procesar el formulario y mostrar la clave secreta en una vista
app.post('/generate', async (req, res) => {
  const parametro = req.body.parametro;

  // Genera la clave secreta
  const secretKey = generateSecretKey();

  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      'INSERT INTO prm.secret_key (parametro, secret_key) VALUES (:parametro, :secretKey)',
      { parametro, secretKey }
    );

    connection.commit();
    connection.close();

    // Renderiza la vista secretkey.html y pasa la variable secretKey a la vista
    res.json({ secretKey })

  } catch (err) {
    console.error(err);
    res.status(500).send('Error al guardar en la base de datos.');
  }
});

function generateSecretKey() {
    // Genera un UUID aleatorio
    const secretKey = uuidv4().replace(/-/g, '');
    return secretKey;
  }

app.listen(port, () => {
  console.log(`La aplicación está corriendo en http://localhost:${port}`);
});
