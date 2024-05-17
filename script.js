// Importamos Express 
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

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

// Importamos los módulos que vamos a utilizar
import { agregarRoommate } from './modulos/roommates.js';
import { actualizarGasto } from './modulos/gastos.js';

// Middlewares
app.use(express.json());

// ruta raíz que devuelve con sendFile el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ruta para agregar un roommate al archivo roommates.json 
app.post('/roommate', async (req, res) => {
    try {
        // Verificamos que el archivo roommates.json existe, si no existe lo creamos con un arreglo vacío
        if (!fs.existsSync("roommates.json")) {
            fs.writeFileSync('roommates.json', '{"roommates":[]}', 'utf8');
        };
        const result = await agregarRoommate();
        res.status(200).send("Roommate creado con éxito!!");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// ruta para obtener todos los roommates del archivo roommates.json
app.get('/roommates', (req, res) => {
    const roommates = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
    res.send(roommates);
});

// ruta para agregar un gasto al archivo gastos.json
app.post('/gasto', async (req, res) => {
    try {
        // Verificamos que el archivo gastos.json existe, si no existe lo creamos con un arreglo vacío
        if (!fs.existsSync("gastos.json")) {
            fs.writeFileSync('gastos.json', '{"gastos": []}', 'utf8');
        };
        const idGasto = uuidv4().slice(24);
        console.log("Esto es req.body: ", req.body);
        const { roommate, descripcion, monto } = req.body;
        const gasto = {
            id: idGasto,
            roommate,
            descripcion,
            monto,
        };
        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
        const gastos = gastosJSON.gastos;
        gastos.push(gasto);
        fs.writeFileSync("gastos.json", JSON.stringify({ gastos }));
        await actualizarGasto();
        res.send("Gasto agregado con existo!!");
        
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// ruta para obtener todos los gastos del archivo gastos.json
app.get('/gastos', (req, res) => {
    const gastos = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
    res.send(gastos);
});

// ruta para ditar un gasto del archivo gastos.json
app.put('/gasto', async (req, res) => {
    try {
        const { id } = req.query;
        const { roommate, descripcion, monto } = req.body;
        const gasto = { id, roommate, descripcion, monto };
        if (!id || !roommate || !descripcion || !monto) {
            res.status(400).send("Debe proporcionar un ID, roommate, descripción y monto");
            return;
        }
        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
        const gastos = gastosJSON.gastos;
        gastosJSON.gastos = gastos.map((b) => b.id === id ? gasto : b);
        fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));
        res.send("Gasto actualizado con éxito!!");
    } catch (error) {
        res.status(500).send(error.message);
        console.log("BARRANCO!!!!!!!!");
    }

});

// ruta para eliminar un gasto del archivo gastos.json
app.delete('/gasto', async (req, res) => {
    try {
        const { id } = req.query;
        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
        const gastos = gastosJSON.gastos;
        gastosJSON.gastos = gastos.filter((b) => b.id !== id);
        fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));
        res.send("Gasto eliminado con éxito!!");
    } catch (error) {
        res.status(500).send(error.message);
    }
});
// ruta generica
app.get("*", (req, res) => {
    res.send("Esta página no existe!!");
});
