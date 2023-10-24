const express = require('express');
const app = express();
const port = 8010;
const bodyParser = require('body-parser');
const oracledb = require('oracledb');

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
  const secretKey = generateSecretKey(parametro);

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

function generateSecretKey(parametro) {
    // Genera una clave secreta aleatoria de 16 caracteres
    const caracteresPermitidos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let secretKey = '';
  
    // Cambia 4 a la cantidad de grupos que deseas y 4 a la longitud de cada grupo
    for (let i = 0; i < 4; i++) {
        let group = '';
        for (let j = 0; j < 4; j++) {
            const randomIndex = Math.floor(Math.random() * caracteresPermitidos.length);
            group += caracteresPermitidos.charAt(randomIndex);
        }
        secretKey += group;
        if (i < 3) {
            secretKey += '';
        }
    }
  
    // Combina el parámetro con la clave secreta (esto es solo un ejemplo)
    const combinedKey = secretKey;
  
    return combinedKey;
  }

app.listen(port, () => {
  console.log(`La aplicación está corriendo en http://localhost:${port}`);
});
