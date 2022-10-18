const express = require('express');
const router = express.Router(); //nos regresa metodos de js y puedo agregar rutas
const usersController = require('../controllers/usersController');

//URLs
router.post('/signUpUser', usersController.signUpUser) 
router.post('/signInUser', usersController.signInUser) 
router.post('/addFavGif', verifyToken, usersController.addFavGif)
router.delete('/deleteFavGif', verifyToken, usersController.deleteFavGif)
router.get('/getFavGifs', verifyToken, usersController.getFavGifs)


// Authorization: Bearer <token>
function verifyToken(req, res, next){
    const bearerHeader =  req.headers['authorization'];
    
    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(" ")[1];
        req.token  = bearerToken;
        next();
    }else{
        res.sendStatus(403);
        console.log('first verifyToken')
    }
}

module.exports = router;