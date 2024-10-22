const controller = {};

// Controlador para listar los pacientes
controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }
        conn.query('SELECT * FROM Mpaciente', (err, customers) => {
            if (err) {
                return res.json(err);
            }
            console.log('customers');
            res.render('Pacientes', {
                data: customers
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
        conn.query('INSERT INTO Mpaciente SET ?', [nuevoPaciente], (err, result) => {
            if (err) {
                return res.json(err);
            }
            res.redirect('/pacientes');
        });
    });
};

// Controlador para mostrar el formulario de pacientes con las direcciones
controller.mostrarFormularioPaciente = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            return res.status(500).send('Error en el servidor');
        }
        const query = 'SELECT * FROM Mdireccion';  // Consulta para obtener direcciones
        conn.query(query, (err, resultados) => {
            if (err) {
                console.error('Error al obtener las direcciones:', err);
                return res.status(500).send('Error en el servidor');
            }
            res.render('formPaciente', { direcciones: resultados });  // Enviar las direcciones a la vista
        });
    });
};

// Controlador para mostrar el formulario de dirección
controller.mostrarFormularioDireccion = (req, res) => {
    res.render('formDireccion'); // Asegúrate de tener la vista 'formDireccion.ejs' creada
};


module.exports = controller;
