import axios from 'axios';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const agregarRoommate = async (req, res) => {
    const { data } = await axios.get('https://randomuser.me/api')
    //Guardar en una variable el objeto que estará en el indice 0 del arreglo. Este objeto representa el usuario random que se está consultando y contiene en sus propiedades la información del mismo.
    const randomRoommate = data.results[0];

    const idRandom = uuidv4().slice(24);
    const nameRoommmate = randomRoommate.name.first;
    let debe = 0;
    let recibe = 0;
    let total = 0;

    //Crea una variable usuario con los valores id, nombre, debe y recibe del usuario random.
    const roommate = {
        id: idRandom,
        nombre: nameRoommmate,
        debe: debe,
        recibe: recibe,
        total: total,
    }

    // Ingresa al arreglo roommates, el userRandom.
    const { roommates } = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
    roommates.push(roommate);

    // Sobrescribe el archivo "roommates.json” con la data nueva
    fs.writeFileSync("roommates.json", JSON.stringify({ roommates }));
    console.log("Roommate creado con éxito!!");
    return roommates;
};

// Exportamos la función agregarRoommate
export { agregarRoommate };