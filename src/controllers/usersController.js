const jwt = require("jsonwebtoken");
const controller = {};

/**
 * funcion enecragada de insertar en la tbl users recibiendo la data del form y mandar jwt
 */
controller.signUpUser = ((req, res) => {
    const {name, lastName, email, password} = req.body //datos del formulario
    console.log(`${name}, ${lastName}, ${email}, ${password}`);
    
    if(name.split(' ').join('') === '' || lastName.split(' ').join('') === '' || email.split(' ').join('') === '' || password.split(' ').join('') === '') return res.status(400).json({ message: 'Invalid data' })

    //check email availability
    req.getConnection((err, conn) => {
        if (err) return res.json(err)
        conn.query('SELECT email FROM users where email = ?', [email], (err, users) => {
            if (err) return res.json(err)
            const userFound = users.length
            if(userFound > 0) return res.status(400).json({ message: 'User already exists' })

            //insert user
            req.getConnection((err, conn) => {
                if (err) return res.json(err)
                conn.query('INSERT INTO users (name, lastName, email, password) VALUES (?, ?, ?, ?)', [name, lastName, email, password], (err, user) => {
                    if (err) return res.json(err)
                    
                    //send data user  
                    return res.status(200).json({
                        message: 'Registered user'
                    })
                })
            })    
        })
    })
})

/**
 * funcion enecragada de validar users recibiendo la data del form y mandar jwt
 */
 controller.signInUser = ((req, res) => {
    const {email, password} = req.body //datos del formulario
    
    //check email exist
    req.getConnection((err, conn) => {
        if (err) return res.json(err)
        conn.query('SELECT email FROM users where email = ?', [email], (err, users) => {
            if (err) return res.json(err)
            const userFound = users.length
            
            if(userFound === 0){ 
                return res.status(400).json({ message: 'Error in email or password' })
            } else{

                //validate password
                req.getConnection((err, conn) => {
                    if (err) return res.json(err)
                    conn.query('SELECT password FROM users where email = ?', [email], (err, userP) => {
                        if (err) return res.json(err)
                        else if(password !== userP[0].password) return res.status(400).json({ message: 'Error in email or password' })
                        
                        //get user data to send
                        req.getConnection((err, conn) => {
                            if (err) return res.json(err)
                            conn.query('SELECT idUser, name, lastName FROM users where email = ?', [email], (err, user) => {
                                if (err) return res.json(err)

                                //send data user 
                                jwt.sign({user}, 'secretkey', {expiresIn: '1h'}, (err, token) => {
                                    if (err) return res.json(err)
                                    return res.status(200).json({
                                        token
                                    })
                                })
                            })
                        })
                    })
                })
            }        
        })
    })
})

/**
 * funcion enecragada de agregar un fav gif a usuario
 */
controller.addFavGif = ((req , res) => {
    jwt.verify(req.token, 'secretkey', (error, authData) => {
        if(error){
            return res.sendStatus(403);
        }else{
            const {idGif} = req.body
            const {idUser} = authData.user[0]

            foundIsFav(req, idGif, idUser).then(resolve => {
                if(resolve > 0) return res.sendStatus(200)
                
                req.getConnection((err, conn) => {
                    if (err) return res.json(err)
                    conn.query('INSERT INTO favorites (FK_idUser, idGif) VALUES (?, ?)', [idUser, idGif], (err, rows) => {
                        if (err) return res.json(err)
    
                        req.getConnection((err, conn) => {
                            if (err) return res.json(err)
                            conn.query('SELECT idGif FROM favorites where FK_idUser = ?', [idUser], (err, rows) => {
                                if (err) return res.json(err)
    
                                return res.status(200).json({
                                    data: rows
                                })
                            })
                        })
                    })
                })
            })
        }
    })
})

/**
 * funcion enecragada de eliminar un fav gif a usuario
 */
 controller.deleteFavGif = ((req , res) => {
    console.log('try deleteFavGif');
    
    jwt.verify(req.token, 'secretkey', (error, authData) => {
        if(error){
            return res.sendStatus(403);
        }else{
            const {idGif} = req.body
            const {idUser} = authData.user[0]
            
            req.getConnection((err, conn) => {
                if (err) return res.json(err)
                conn.query('DELETE FROM favorites WHERE (FK_idUser = ? and idGif = ?)', [idUser, idGif], (err, rows) => {
                    if (err) return res.json(err)
                    
                    req.getConnection((err, conn) => {
                        if (err) return res.json(err)
                        conn.query('SELECT idGif FROM favorites where FK_idUser = ?', [idUser], (err, rows) => {
                            if (err) return res.json(err)

                            return res.status(200).json({
                                data: rows
                            })
                        })
                    })
                })
            })
        }
    })
})

/**
 * funcion enecragada mandar los favs gifs de un usuario
 */
controller.getFavGifs = ((req , res) => {
    jwt.verify(req.token, 'secretkey', (error, authData) => {
        if(error){
            return res.sendStatus(403);
        }else{
            const {idUser} = authData.user[0]
            
            req.getConnection((err, conn) => {
                if (err) return res.json(err)
                conn.query('SELECT idGif FROM favorites where FK_idUser = ?', [idUser], (err, rows) => {
                    if (err) return res.json(err)
                    return res.status(200).json({
                        data: rows
                    })
                })
            })
        }
    })
})


const foundIsFav = (req, idGif, idUser) => {
    return new Promise(resolve => {
        req.getConnection((err, conn) => {
            if (err) return err

            conn.query('SELECT idfavorites FROM favorites where (FK_idUser = ? and idGif = ?)', [idUser, idGif], (err, rows) => {
                if (err) return err
                return resolve(rows.length)
            })
        })
    })
}

module.exports = controller;