const {
  MYSQL_DB,
  MYSQL_PASSWORD,
  MYSQL_URI,
  MYSQL_USER,
  PORT,
} = require("../config/setings");

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: MYSQL_URI,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DB,
      port: PORT,
    },
  },
  // Otros entornos de configuración (por ejemplo, producción, prueba, etc.)
};
