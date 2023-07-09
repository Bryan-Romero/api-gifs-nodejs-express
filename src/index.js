const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const knex = require("knex");
const knexConfig = require("./config/knexfile");

//importing routes
const usersRoutes = require("./routes/users");

//setings
const PORT_SERVER = 4000 || 3000;
app.use(cors());
app.use(express.json());

//middleware
app.use(morgan("dev"));
const db = knex(knexConfig.development);

// Attach the database connection to the request
app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use(express.urlencoded({ extended: false }));

//routes
app.use("/", usersRoutes);

//static files
app.use(express.static(path.join(__dirname, "public")));

//starting the server
app.listen(PORT_SERVER, () => {
  console.log(`Server on port ${PORT_SERVER}`);
});
