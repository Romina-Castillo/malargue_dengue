const controller = {};

// Controlador para listar los pacientes
controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).send('Error en el servidor');
        }
        conn.query('SELECT * FROM Mpacientes', (err, pacientes) => { // Cambié 'customers' a 'pacientes'
            if (err) {
                console.error('Error al obtener pacientes:', err);
                return res.status(500).send('Error en el servidor');
            }
            res.render('pacientes', {
                pacientes: pacientes // Asegúrate de que aquí se pasa 'pacientes'
            });
        });
    });
};

// Controlador para agregar pacientes
controller.agregar = (req, res) => {
    const { nombre, apellido, tipo_caso, id_direccion } = req.body;
    const nuevoPaciente = {
        nombre,
        apellido,
        tipo_caso,
        id_direccion
    };

    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }
        conn.query('INSERT INTO Mpacientes SET ?', [nuevoPaciente], (err, result) => {
            if (err) {
                return res.json(err);
            }
            res.redirect('/pacientes'); // Redirige al listado de pacientes
        });
    });
};

// Controlador para mostrar el formulario de pacientes con las direcciones
controller.mostrarFormularioPaciente = (req, res) => {
    const idDireccion = req.query.id_direccion; // Obtén el ID de dirección de los parámetros de la consulta
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            return res.status(500).send('Error en el servidor');
        }
        const query = 'SELECT * FROM Mdireccion'; // Consulta para obtener direcciones
        conn.query(query, (err, resultados) => {
            if (err) {
                console.error('Error al obtener las direcciones:', err);
                return res.status(500).send('Error en el servidor');
            }
            res.render('formPaciente', { direcciones: resultados, idDireccion }); // Envía el ID a la vista
        });
    });
};

// Controlador para mostrar el formulario de dirección
controller.mostrarFormularioDireccion = (req, res) => {
    res.render('formDireccion'); // Asegúrate de tener la vista 'formDireccion.ejs' creada
};

// Controlador para agregar direcciones
controller.agregarDireccion = (req, res) => {
    const { barrio, calle, numero } = req.body;
    const nuevaDireccion = {
        barrio,
        calle,
        numero
    };

    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }
        conn.query('INSERT INTO Mdireccion SET ?', [nuevaDireccion], (err, result) => {
            if (err) {
                return res.json(err);
            }
            const idDireccion = result.insertId; // Obtén el ID de la dirección recién registrada
            // Redirige al formulario de registro de pacientes con el ID de dirección como parámetro
            res.redirect(`/pacientes/formPaciente?id_direccion=${idDireccion}`);
        });
    });
};



module.exports = controller;
