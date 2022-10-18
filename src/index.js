const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const cors = require('cors');
const PORT = 4000



//importing routes
const usersRoutes = require('./routes/users');

//setings
app.set('port', process.env.PORT || 3000) //revisar si hay un purto y si no usar el 3000
app.use(cors());
app.use(express.json());

//middleware
app.use(morgan('dev')); //mensaje en consola tipoDePeticion Ruta Respuesta Tiempo - Peso
app.use(myConnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '12345',
    port: 3306,
    database: 'app_gifs'
}, 'single'));
app.use(express.urlencoded({ extended: false }));


//routes
app.use('/', usersRoutes);

//static files
app.use(express.static(path.join(__dirname, 'public')));

//starting the server
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
})
