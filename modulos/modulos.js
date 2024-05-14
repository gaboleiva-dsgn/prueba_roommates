import axios from 'axios';
import { Console } from 'console';
import fs from 'fs';

const agregarRoommate = async (req, res) => {
    const { data } = await axios.get('https://randomuser.me/api')
    //console.log(data)
    //Guardar en una variable el objeto que estará en el indice 0 del arreglo. Este objeto representa el usuario random que se está consultando y contiene en sus propiedades la información del mismo.
    const randomRoommate = data.results[0];
    //Crea una variable usuario con los valores primer nombre, apellido y email del usuario random.
    const roommate = {
         nombre: randomRoommate.name.first,
         debe: '',
         recibe: '',
    }
    // console.log(usuario)
    // res.send(usuario)

    //Ingresa al arreglo roommates, el usuario random.
const { roommates } = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
roommates.push(roommate);
//Sobrescribe el archivo "roommates.json” con la data nueva
fs.writeFileSync("roommates.json", JSON.stringify({ roommates }));
console.log("Roommate creado con éxito!!");
return roommates;
};
    

export  { agregarRoommate };