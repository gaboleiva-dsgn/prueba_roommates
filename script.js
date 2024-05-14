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

import { agregarRoommate } from './modulos/roommates.js';
// import { agregarGasto } from './modulos/gastos.js';

app.use(express.json());

// ruta raíz que devuelve con sendFile el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/roommate', async (req, res) => {
    try {
        // Verificamos que el archivo roommates.json existe, si no existe lo creamos con un arreglo vacío
        if (!fs.existsSync("roommates.json")) {
            fs.writeFileSync('roommates.json', '{"roommates": []}', 'utf8');
        };
        const result = await agregarRoommate();
        res.send("Roommate creado con éxito!!", result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/roommates', (req, res) => {
    const { roommates } = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
    res.send(roommates);
});

app.post('/gasto', async (req, res) => {
    try {
        // Verificamos que el archivo gastos.json existe, si no existe lo creamos con un arreglo vacío
        if (!fs.existsSync("gastos.json")) {
            fs.writeFileSync('gastos.json', '{"gastos": []}', 'utf8');
        };
        // const result = await agregarGasto();
        console.log("Esto es req.body: ", req.body);
        const { nombre, comentario, monto } = req.body;
        const gasto = {
            nombre,
            comentario,
            monto,
        };
        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
        const gastos = gastosJSON.gastos;
        gastos.push(gasto);
        fs.writeFileSync("gastos.json", JSON.stringify({ gastos }));
        res.send("Gasto agregado con existo!!");
    } catch (error) {
        console.log("Como que no existe?");
        res.status(500).send(error.message);
    }
});

app.get('/gastos', (req, res) => {
    const { gastos } = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
    res.send(gastos);
});

// ruta generica
app.get("*", (req, res) => {
    res.send("Esta página no existe!!");
});