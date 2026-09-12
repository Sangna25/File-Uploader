const {Router} = require("express");
const authRouter= Router();
const authController = require('../controllers/authController');


authRouter.post('/register', authController.register);
authRouter.post('/login', authController.authenticateLogin, authController.login);
authRouter.delete('/logout', authController.logout);
authRouter.get("/me", authController.getCurrentUser);

module.exports = authRouter;