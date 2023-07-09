const {
  MYSQL_DB,
  MYSQL_PASSWORD,
  MYSQL_URI,
  MYSQL_USER,
  PORT,
} = require("./config/setings");
const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");
const mysql = require("mysql2");
const myConnection = require("express-myconnection");
const cors = require("cors");

//importing routes
const usersRoutes = require("./routes/users");

//setings
const PORT_SERVER = 4000 || 3000; //revisar si hay un purto y si no usar el 3000
app.use(cors());
app.use(express.json());

//middleware
app.use(morgan("dev")); //mensaje en consola tipoDePeticion Ruta Respuesta Tiempo - Peso
try {
  app.use(
    myConnection(mysql, {
      host: MYSQL_URI,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      port: PORT,
      database: MYSQL_DB,
      connectTimeout: 60000,
    })
  );
  console.log(`DB is connected`);
} catch (e) {
  console.log(e);
}

app.use(express.urlencoded({ extended: false }));

//routes
app.use("/", usersRoutes);

//static files
app.use(express.static(path.join(__dirname, "public")));

//starting the server
app.listen(PORT_SERVER, () => {
  console.log(`Server on port ${PORT_SERVER}`);
});
