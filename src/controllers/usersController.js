const jwt = require("jsonwebtoken");
const controller = {};

/**
 * función encargada de insertar en la tabla users recibiendo la data del formulario y mandar jwt
 */
controller.signUpUser = async (req, res) => {
  const { name, lastName, email, password } = req.body; //datos del formulario
  console.log(`${name}, ${lastName}, ${email}, ${password}`);

  if (
    name.split(" ").join("") === "" ||
    lastName.split(" ").join("") === "" ||
    email.split(" ").join("") === "" ||
    password.split(" ").join("") === ""
  )
    return res.status(400).json({ message: "Invalid data" });

  try {
    const db = req.db;
    const users = await db.select("email").from("users").where("email", email);

    const userFound = users.length;
    if (userFound > 0)
      return res.status(400).json({ message: "User already exists" });

    const user = await db("users").insert({
      name,
      lastName,
      email,
      password,
    });

    return res.status(200).json({
      message: "Registered user",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * función encargada de validar users recibiendo la data del formulario y mandar jwt
 */
controller.signInUser = async (req, res) => {
  const { email, password } = req.body; //datos del formulario

  try {
    const db = req.db;
    const users = await db.select("email").from("users").where("email", email);

    const userFound = users.length;

    if (userFound === 0) {
      return res.status(400).json({ message: "Error in email or password" });
    }

    const userP = await db
      .select("password")
      .from("users")
      .where("email", email);

    if (password !== userP[0].password)
      return res.status(400).json({ message: "Error in email or password" });

    const user = await db
      .select("idUser", "name", "lastName")
      .from("users")
      .where("email", email);

    jwt.sign({ user }, "secretkey", { expiresIn: "1h" }, (err, token) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }

      return res.status(200).json({
        token,
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * función encargada de agregar un fav gif a usuario
 */
controller.addFavGif = async (req, res) => {
  jwt.verify(req.token, "secretkey", async (error, authData) => {
    if (error) {
      return res.sendStatus(403);
    } else {
      const { idGif } = req.body;
      const { idUser } = authData.user[0];

      try {
        const db = req.db;

        const resolve = await foundIsFav(db, idGif, idUser);

        if (resolve > 0) return res.sendStatus(200);

        await db("favorites").insert({
          FK_idUser: idUser,
          idGif,
        });

        const rows = await db
          .select("idGif")
          .from("favorites")
          .where("FK_idUser", idUser);

        return res.status(200).json({
          data: rows,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  });
};

/**
 * función encargada de eliminar un fav gif a usuario
 */
controller.deleteFavGif = async (req, res) => {
  console.log("try deleteFavGif");

  jwt.verify(req.token, "secretkey", async (error, authData) => {
    if (error) {
      return res.sendStatus(403);
    } else {
      const { idGif } = req.body;
      const { idUser } = authData.user[0];

      try {
        const db = req.db;

        await db("favorites")
          .where("FK_idUser", idUser)
          .where("idGif", idGif)
          .delete();

        const rows = await db
          .select("idGif")
          .from("favorites")
          .where("FK_idUser", idUser);

        return res.status(200).json({
          data: rows,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  });
};

/**
 * función encargada de mandar los favs gifs de un usuario
 */
controller.getFavGifs = async (req, res) => {
  jwt.verify(req.token, "secretkey", async (error, authData) => {
    if (error) {
      return res.sendStatus(403);
    } else {
      const { idUser } = authData.user[0];

      try {
        const db = req.db;

        const rows = await db
          .select("idGif")
          .from("favorites")
          .where("FK_idUser", idUser);

        return res.status(200).json({
          data: rows,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  });
};

const foundIsFav = async (db, idGif, idUser) => {
  try {
    const rows = await db
      .select("idfavorites")
      .from("favorites")
      .where("FK_idUser", idUser)
      .where("idGif", idGif);

    return rows.length;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = controller;
