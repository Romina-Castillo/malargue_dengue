const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql2');
const myConnection = require('express-myconnection');

const app = express();

// Importando rutas
const customerRoutes = require('./routes/customer');

// Configuración del puerto
app.set('port', process.env.PORT || 3005);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(morgan('dev'));
app.use(myConnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '12345',
    port: 3306,
    database: 'crudmalargue'
}, 'single'));

// Rutas
app.use('/', customerRoutes);

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Comprobación de conexión a la base de datos cuando se inicie el servidor
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
    // Aquí puedes crear una conexión temporal para verificar
    mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '12345',
        database: 'crudmalargue'
    }).connect((err) => {
        if (err) {
            console.error('Error de conexion:', err);
        } else {
            console.log('Conectado a DB!');
        }
    });
});