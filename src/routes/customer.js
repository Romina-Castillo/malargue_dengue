const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerController');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');

// Controlador para la vista de home
router.get('/', (req, res) => {
    res.render('home', { user: req.session.user });
});

// Controlador para mostrar el formulario de login
router.get('/login', (req, res) => {
    res.render('login');
});

// Controlador para mostrar el formulario de registro
router.get('/register', (req, res) => {
    res.render('register');
});

// Controlador para manejar la lógica de registro (POST)
router.post('/register', (req, res) => {
    const { nombre_usuario, email, contraseña } = req.body;

    // Encriptar la contraseña antes de guardar
    bcrypt.hash(contraseña, 10, (err, hash) => {
        if (err) {
            console.error('Error al encriptar la contraseña:', err);
            return res.status(500).send('Error al encriptar la contraseña');
        }

        const nuevoUsuario = {
            nombre_usuario,
            email,
            contraseña: hash
        };

        req.getConnection((err, conn) => {
            if (err) {
                console.error('Error de conexión:', err);
                return res.status(500).send('Error en el servidor');
            }

            // Verificar si el email ya existe
            conn.query('SELECT * FROM Musuario WHERE email = ?', [email], (err, results) => {
                if (err) {
                    console.error('Error al verificar el email:', err);
                    return res.status(500).send('Error en el servidor');
                }

                if (results.length > 0) {
                    // El correo ya está en uso
                    return res.status(400).send('Este correo ya está registrado. Por favor, utiliza otro correo.');
                }

                // Inserción del nuevo usuario
                conn.query('INSERT INTO Musuario SET ?', [nuevoUsuario], (err, result) => {
                    if (err) {
                        console.error('Error al insertar el nuevo usuario:', err);
                        return res.status(500).send('Error en el servidor');
                    }
                    res.redirect('/login'); // Redirige al login después de registrar
                });
            });
        });
    });
});


// Controlador para manejar la lógica de login (POST)
router.post('/login', (req, res) => {
    const { email, contraseña } = req.body;

    req.getConnection((err, conn) => {
        if (err) return res.json(err);
        conn.query('SELECT * FROM Musuario WHERE email = ?', [email], (err, results) => {
            if (err) return res.json(err);
            if (results.length === 0) {
                return res.redirect('/login'); // usuario no encontrado
            }

            // Comparar la contraseña
            const usuario = results[0];
            bcrypt.compare(contraseña, usuario.contraseña, (err, match) => {
                if (err || !match) {
                    return res.redirect('/login'); // Contraseña incorrecta
                }

                req.session.user = usuario; // se almacena el usuario en la sesión
                res.redirect('/pacientes'); // redirige al listado de pacientes
            });
        });
    });
});

// Ruta para el listado de pacientes
router.get('/pacientes', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // redirige al login si no está logueado
    }

    // Consulta para obtener el listado de pacientes
    req.getConnection((err, conn) => {
        if (err) return res.json(err);
        conn.query('SELECT * FROM Mpacientes', (err, results) => {
            if (err) return res.json(err);
            res.render('pacientes', {
                pacientes: results,
                user: req.session.user // pasa el usuario logueado a la vista 
                // agregar en los render de las vistas necesarias  ", { user: req.session.user }"
            });
        });
    });
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.json(err);
        res.redirect('/'); // redirige a la ruta principal después de cerrar sesión
    });
});

// Ruta para mostrar el formulario de agregar pacientes
router.get('/pacientes/formPaciente', controller.mostrarFormularioPaciente);

// Ruta para procesar el formulario de agregar pacientes
router.post('/pacientes/agregar', controller.agregar);

// Ruta para mostrar el formulario de agregar direcciones
router.get('/direcciones/formulario', controller.mostrarFormularioDireccion);

// Ruta para agregar una nueva dirección
router.post('/direcciones/agregar', controller.agregarDireccion);

router.get('/registrar', controller.mostrarFormularioPaciente);


module.exports = router;
