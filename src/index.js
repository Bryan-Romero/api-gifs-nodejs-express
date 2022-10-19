const config = require('./config/setings');
const {MYSQL_URI, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB } = config
const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const cors = require('cors');


//importing routes
const usersRoutes = require('./routes/users');

//setings
const PORT = process.env.PORT || 3000 //revisar si hay un purto y si no usar el 3000
app.use(cors());
app.use(express.json());

//middleware
app.use(morgan('dev')); //mensaje en consola tipoDePeticion Ruta Respuesta Tiempo - Peso
try{
    app.use(myConnection(mysql, {
        host: MYSQL_URI,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        port: 3306,
        database: MYSQL_DB
    }, 'single'));
    console.log(`DB is connected`);
} catch(e){
    console.log(e);
}

app.use(express.urlencoded({ extended: false }));


//routes
app.use('/', usersRoutes);

//static files
app.use(express.static(path.join(__dirname, 'public')));

//starting the server
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
})



app.use((req, res) => {
    res.send('Hello Word!')
});