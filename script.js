// Importamos Express 
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Creamos una instancia de express
const app = express();

// Escuchamos el puerto 3000
const PORT = process.env.PORT || 3000;

// Levantamos el servidor en el puerto 3000
app.listen(PORT, () => {
    console.log(`Servidor corriendo por el puerto ${PORT}`);
});

import { agregarRoommate } from './modulos/modulos.js';

app.use(express.json());

// ruta raíz que devuelve con sendFile el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/roommate', async (req, res) => {
    try {
        const result = await agregarRoommate();
        res.send("Roommate creado con éxito!!");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/roommates', (req, res) => {
    const { roommates } = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
    res.send(roommates);
});