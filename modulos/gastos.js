import fs from 'fs';

const actualizarGasto = async (req, res) => {
    try {
        const gastosJSON = await traerGasto();
        const roommatesJSON = await traerRoommates();
        const gastos = gastosJSON.gastos;
        const roommates = roommatesJSON.roommates;

        roommates.forEach(roommate => {
            roommate.debe = 0;
            roommate.recibe = 0;
        });

        gastos.forEach(gasto => {
            const montoPorRoommate = gasto.monto / roommates.length;
            roommates.forEach(roommate => {
                if (roommate.nombre == gasto.roommate) {
                    roommate.recibe += montoPorRoommate * (roommates.length - 1);
                } else {
                    roommate.debe += montoPorRoommate;
                }
            });
        });

        roommates.forEach(roommate => {
            roommate.total = roommate.recibe - roommate.debe;
        });

        fs.writeFileSync("roommates.json", JSON.stringify({ roommates }));

    } catch (error) {
        res.status(500).send(error.message);
    }
}

const traerGasto = async (req, res) => {
    const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
    return gastosJSON;
};

const traerRoommates = async (req, res) => {
    const roommatesJSON = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
    return roommatesJSON;
};

export { actualizarGasto };